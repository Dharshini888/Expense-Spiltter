package com.examly.springapp.config;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.web.servlet.config.annotation.CorsRegistry;

import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration

public class CorsConfig {

    @Bean

    public WebMvcConfigurer corsConfigurer() {

        return new WebMvcConfigurer() {

            @Override

            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/**")

                        .allowedOrigins("*") // You can restrict later to your frontend URL

                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

                        .allowedHeaders("*")

                        .allowCredentials(false);

            }

        };

    }

}

// package com.examly.springapp.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration

// public class CorsConfig {

// @Bean

// public WebMvcConfigurer corsConfigurer() {

// return new WebMvcConfigurer() {

// @Override

// public void addCorsMappings(CorsRegistry registry) {

// registry.addMapping("/**")

// .allowedOrigins(

// "https://8081-efefdedbcfdddbcbdbdafadccbeceaccf.premiumproject.examly.io",

// "http://localhost:3000" // for local development

// )

// .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

// .allowedHeaders("*")

// .allowCredentials(true)

// .maxAge(3600);

// }

// };

// }

// }

// // // package com.examly.springapp.config;

// // // import org.springframework.context.annotation.Bean;

// // // import org.springframework.context.annotation.Configuration;

// // // import org.springframework.web.servlet.config.annotation.CorsRegistry;

// // // import
// org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// // // @Configuration

// // // public class CorsConfig {

// // // @Bean

// // // public WebMvcConfigurer corsConfigurer() {

// // // return new WebMvcConfigurer() {

// // // @Override

// // // public void addCorsMappings(CorsRegistry registry) {

// // // registry.addMapping("/**")

// // // .allowedOrigins("*")

// // // .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

// // // .allowedHeaders("*");

// // // }

// // // };

// // // }

// // // }

// // // // package com.examly.springapp.config;

// // // // import org.springframework.context.annotation.Bean;

// // // // import org.springframework.context.annotation.Configuration;

// // // // import
// org.springframework.web.servlet.config.annotation.CorsRegistry;

// // // // import
// // org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// // // // @Configuration

// // // // public class WebConfig {

// // // // @Bean

// // // // public WebMvcConfigurer corsConfigurer() {

// // // // return new WebMvcConfigurer() {

// // // // @Override

// // // // public void addCorsMappings(CorsRegistry registry) {

// // // // registry.addMapping("/**")

// // // // .allowedOrigins(

// // // //
// // "https://8081-efefdedbcfdddbcbdbdafadccbeceaccf.premiumproject.examly.io",

// // // //
// // "https://8081-efefdedbcfdddbcbdbdafabaabcfabda.premiumproject.examly.io"

// // // // )

// // // // .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

// // // // .allowedHeaders("*")

// // // // .allowCredentials(true)

// // // // .maxAge(3600);

// // // // }

// // // // };

// // // // }

// // // // }

// // // // package com.examly.springapp.config;

// // // // import org.springframework.context.annotation.Bean;

// // // // import org.springframework.context.annotation.Configuration;

// // // // import
// org.springframework.web.servlet.config.annotation.CorsRegistry;

// // // // import
// // org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// // // // @Configuration

// // // // public class WebConfig {

// // // // @Bean

// // // // public WebMvcConfigurer corsConfigurer() {

// // // // return new WebMvcConfigurer() {

// // // // @Override

// // // // public void addCorsMappings(CorsRegistry registry) {

// // // // registry.addMapping("/**")

// // // // .allowedOrigins(

// // // //
// // "https://8081-efefdedbcfdddbcbdbdafabaabcfabda.premiumproject.examly.io"

// // // // )

// // // // .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

// // // // .allowedHeaders("*")

// // // // .allowCredentials(true);

// // // // }

// // // // };

// // // // }

// // // // }