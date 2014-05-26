package virtualsensitive;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.context.embedded.MultiPartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.couchbase.client.CouchbaseClient;
import com.couchbase.client.protocol.views.ComplexKey;
import com.couchbase.client.protocol.views.Query;
import com.couchbase.client.protocol.views.View;
import com.couchbase.client.protocol.views.ViewResponse;
import com.couchbase.client.protocol.views.ViewRow;

import java.io.BufferedOutputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.MultipartConfigElement;

@Controller
@EnableAutoConfiguration
@EnableWebMvcSecurity
public class VirtualSensitiveController extends WebMvcConfigurerAdapter {
	// couchbase client, constructor and application
	private CouchbaseClient client = null;
	public VirtualSensitiveController() throws Exception {
		ArrayList<URI> nodes = new ArrayList<URI>();
		nodes.add(URI.create("http://127.0.0.1:8091/pools"));
		client = new CouchbaseClient(nodes, "default", "");
	}
	public static void main(String[] args) throws Exception {
		SpringApplication.run(VirtualSensitiveController.class, args);
	}

	// spring security
	@Override	
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/home").setViewName("home");
		registry.addViewController("/hello").setViewName("hello");
		registry.addViewController("/admin/login").setViewName("login");
	}
	@Bean
	public ApplicationSecurity applicationSecurity() {
		return new ApplicationSecurity();
	}
	protected static class ApplicationSecurity extends WebSecurityConfigurerAdapter {

		@Override
		protected void configure(HttpSecurity http) throws Exception {
			http.csrf().disable();
			http
			.authorizeRequests()
			.antMatchers("/admin/**", "/page/**", "/component/**", "/listComponents/**", "/upload/**").authenticated()
			.anyRequest().permitAll();
			http
			.formLogin()
			.loginPage("/admin/login")
			.permitAll()
			.and()
			.logout()
			.permitAll();
		}

		@Override
		protected void configure(AuthenticationManagerBuilder auth) throws Exception {
			auth
			.inMemoryAuthentication()
			.withUser("user").password("password").roles("USER");
		}
	}


	// upload file / delete file
	@Bean
	public MultipartConfigElement multipartConfigElement() {
		MultiPartConfigFactory factory = new MultiPartConfigFactory();
		factory.setMaxFileSize("10MB");
		factory.setMaxRequestSize("10MB");
		return factory.createMultipartConfig();
	}
	@RequestMapping(value="/upload", method=RequestMethod.POST)
	public @ResponseBody String handleFileUpload(@RequestParam("name") List<String> names,
			@RequestParam("file") List<MultipartFile> files){
		String message = "";
		String name;
		MultipartFile file;
		
		for (int i = 0; i < files.size(); ++i) {
			name = names.get(i);
			file = files.get(i);
			if (!file.isEmpty() || !name.isEmpty()) {
				try {
					byte[] bytes = file.getBytes();
					BufferedOutputStream stream =
							new BufferedOutputStream(new FileOutputStream(new File("public/" + name)));
					stream.write(bytes);
					stream.close();
					System.out.println("You successfully uploaded " + name + " into " + "public/" + name);
					message +=  "You successfully uploaded " + name + " into " + "public/" + name + "<br/>";
				} catch (Exception e) {
					System.out.println("You failed to upload " + name + " => " + e.getMessage());
					message +=  "You failed to upload " + name + " => " + e.getMessage() + "<br/>";
				}
			} else {
				System.out.println("You failed to upload " + name + " because the file was empty.");
				message += "You failed to upload " + name + " because the file was empty.<br/>";
			}
		}
		
		return message;
	}
	@RequestMapping(value="/upload/{name}", method=RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<String>  deleteFile(@PathVariable("name") String name) throws Exception {
		File file = null;
		try {
			file = new File("public/" + name);

			if(file.delete()){
				return new ResponseEntity<String>("file deleted", HttpStatus.OK);
			} else {
				return new ResponseEntity<String>("error in file deleting (while deleting the file)", HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (Exception ex) {
			return new ResponseEntity<String>("error in file deleting (while deleting the file)", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// page publish / delete
	@RequestMapping(value="/page/{name:.+}", method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String>  publishPage(@PathVariable("name") String name, @RequestBody String body) throws Exception {
		Writer writer = null;
		try {
			writer = new BufferedWriter(new OutputStreamWriter(
					new FileOutputStream("public/" + name), "utf-8"));
			writer.write(body);
		} catch (IOException ex) {
			return new ResponseEntity<String>("error in page publishing (while creating the file to be served)", HttpStatus.INTERNAL_SERVER_ERROR);
		} finally {
			try {writer.close();} catch (Exception ex) {}
		}
		return new ResponseEntity<String>("page published", HttpStatus.OK);
	}
	@RequestMapping(value="/page/{name}", method=RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<String>  deletePage(@PathVariable("name") String name) throws Exception {
		File file = null;
		try {
			file = new File("public/" + name);

			if(file.delete()){
				return new ResponseEntity<String>("page deleted", HttpStatus.OK);
			} else {
				return new ResponseEntity<String>("error in page deleting (while deleting the file)", HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} catch (Exception ex) {
			return new ResponseEntity<String>("error in page deleting (while deleting the file)", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	// rest json component
	@RequestMapping(value="/component/{key}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> getComponent(@PathVariable("key") String key) throws Exception {
		String result = (String) client.get(key);
		if (result!=null)
			return new ResponseEntity<String>(result, HttpStatus.OK);
		else
			return new ResponseEntity<String>("", HttpStatus.NOT_FOUND);
	}
	@RequestMapping(value="/component/{key}", method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<String> setComponent(@PathVariable("key") String key, @RequestBody String body) throws Exception {
		client.set(key, body);
		return new ResponseEntity<String>("Thing saved [key:"+key+"].", HttpStatus.CREATED);
	}
	@RequestMapping(value="/component/{key}", method=RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<String> deleteComponent(@PathVariable("key") String key, @RequestBody String body) throws Exception {
		client.delete(key);
		return new ResponseEntity<String>("Thing deleted [key:"+key+"].", HttpStatus.OK);
	}

	// Give back the published component identified by type and its language
	@RequestMapping(value="/component/{lang}/{type}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String>  getPublishedComponent(@PathVariable("lang") String lang, @PathVariable("type") String type) throws Exception {
		View view = client.getView("component", "v_component");

		Query query = new Query();
		query.setKey(ComplexKey.of(lang, type, true));
		query.setIncludeDocs(true);

		System.out.println("\ngetPublishedComponent begins.");
		ViewResponse response = null;
		response = client.query(view, query);

		String result = null;
		for(ViewRow row : response) {
			result = row.getDocument().toString();
		}

		System.out.println("getPublishedComponent ends.");

		if (result!=null)
			return new ResponseEntity<String>(result, HttpStatus.OK);
		else
			return new ResponseEntity<String>("", HttpStatus.NOT_FOUND);
	}

	// Give back the list of all components identified by type and language
	@RequestMapping(value="/listComponents/{lang}/{type}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String>  getAllComponents(@PathVariable("lang") String lang, @PathVariable("type") String type) throws Exception {
		View view = client.getView("component", "v_all_components");

		Query query = new Query();
		query.setKey(ComplexKey.of(lang, type));
		query.setIncludeDocs(true);

		System.out.println("\ngetAllComponents begins");
		ViewResponse response = null;
		response = client.query(view, query);

		boolean hasResponses = false;
		StringBuilder result = new StringBuilder("[ ");
		for(ViewRow row : response) {
			result.append(row.getDocument().toString());
			result.append(", ");
			hasResponses = true;
		}

		System.out.println("getAllComponents ends");
		if (hasResponses) {
			result.delete(result.length()-2, result.length());
			result.append(" ]");
			return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("", HttpStatus.NOT_FOUND);
		}
	}
	
	// Give back the list of all components identified by type
	@RequestMapping(value="/listComponentsByType/{type}", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String>  getAllComponentsByType(@PathVariable("type") String type) throws Exception {
		View view = client.getView("component", "v_all_components_by_type");

		Query query = new Query();
		query.setKey(type);
		query.setIncludeDocs(true);

		System.out.println("\ngetAllComponentsByType begins");
		ViewResponse response = null;
		response = client.query(view, query);

		boolean hasResponses = false;
		StringBuilder result = new StringBuilder("[ ");
		for(ViewRow row : response) {
			result.append(row.getDocument().toString());
			result.append(", ");
			hasResponses = true;
		}

		System.out.println("ngetAllComponentsByType ends");
		if (hasResponses) {
			result.delete(result.length()-2, result.length());
			result.append(" ]");
			return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("", HttpStatus.NOT_FOUND);
		}
	}
	// Give back the list of all templates identified by type and language
	@RequestMapping(value="/listTemplates", method=RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String>  getTemplates() throws Exception {
		View view = client.getView("component", "v_templates");

		Query query = new Query();
		query.setKey("template");
		query.setIncludeDocs(true);

		System.out.println("\ngetTemplates begins");
		ViewResponse response = null;
		response = client.query(view, query);

		boolean hasResponses = false;
		StringBuilder result = new StringBuilder("[ ");
		for(ViewRow row : response) {
			result.append(row.getDocument().toString());
			result.append(", ");
			hasResponses = true;
		}

		System.out.println("getTemplates ends");
		if (hasResponses) {
			result.delete(result.length()-2, result.length());
			result.append(" ]");
			return new ResponseEntity<String>(result.toString(), HttpStatus.OK);
		}
		else {
			return new ResponseEntity<String>("", HttpStatus.NOT_FOUND);
		}
	}
}