CREATE TABLE attributes(
	source_id varchar(255) NOT NULL,
	attribute_name varchar(255) NOT NULL,
	attribute_value text NOT NULL,
	PRIMARY KEY (source_id, attribute_name, attribute_value)
);
