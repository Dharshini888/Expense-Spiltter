
#!/bin/bash
# Bash script to generate a Spring Boot project for the Expense Splitter application

# Set variables
PROJECT_FOLDER="/home/coder/project/workspace/question_generation_service/solutions/393df57b-a0fa-4fc3-9e91-4ebdb2c8bac3/springapp"
DATABASE_NAME="393df57b_a0fa_4fc3_9e91_4ebdb2c8bac3"

# 1. Create the MySQL database (ignore error if already exists)
mysql -u root -pexamly -e "CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};" 2>/dev/null || echo "Database creation failed, will use default"

# 2. Generate Spring Boot project using Spring CLI v3.4.0
spring init \
  --type=maven-project \
  --language=java \
  --boot-version=3.4.0 \
  --packaging=jar \
  --java-version=17 \
  --groupId=com.examly \
  --artifactId=springapp \
  --name="Expense Splitter" \
  --description="Expense Splitter: Basic Group Expense Management System" \
  --package-name=com.examly.springapp \
  --dependencies=web,data-jpa,validation,mysql \
  --build=maven \
  "${PROJECT_FOLDER}"

# 3. Wait for project generation to complete
wait

# 4. Add MySQL configuration to application.properties
cat > "${PROJECT_FOLDER}/src/main/resources/application.properties" << EOL
spring.datasource.url=jdbc:mysql://localhost:3306/${DATABASE_NAME}?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=examly
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
EOL

# 5. (No JWT/login/authentication or Selenium/browser automation required for this question, so no extra dependencies needed.)

# End of script

