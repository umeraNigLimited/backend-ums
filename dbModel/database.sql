-- Umera  Emails 
CREATE TABLE emails {
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
}

-- Umera Departments
CREATE TABLE umera_departments (
    department_id VARCHAR(50) PRIMARY KEY,
    department_name VARCHAR(255) UNIQUE NOT NULL,
    department_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Functionn to Check for Department Update
CREATE OR REPLACE FUNCTION on_updated_at_column_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON umera_departments
FOR EACH ROW
EXECUTE FUNCTION on_updated_at_column_update();

-- Staffs Email 
CREATE TABLE umera_staff_email (
    email_id SERIAL PRIMARY KEY,
    staff_email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON umera_staff_email
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Table for user authentication details (login credentials)
CREATE TABLE signUp_staff (
    id SERIAL PRIMARY KEY,
    -- staff_id VARCHAR(255) UNIQUE NOT NULL,
    staff_fullname VARCHAR(255) NOT NULL,
    staff_official_email VARCHAR(255) UNIQUE NOT NULL,
    staff_personal_email VARCHAR(255) UNIQUE NOT NULL,
    staff_department VARCHAR(50) REFERENCES umera_departments(department_id),
    staff_role VARCHAR(255) NOT NULL,
    staff_password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Staff information and user profile data
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department_id INT REFERENCES departments(department_id),
    join_date DATE NOT NULL,
    position VARCHAR(255),
    profile_picture_url VARCHAR(255),
    leave_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE staff (
--     staff_id VARCHAR(50) PRIMARY KEY,
--     last_name VARCHAR(255) NOT NULL,
--     other_name VARCHAR(255) NOT NULL,
--     personal_email VARCHAR(255) UNIQUE NOT NULL,
--     office_email VARCHAR(255) UNIQUE NOT NULL,
--     department_id VARCHAR(50) REFERENCES umera_departments(department_id),
--     join_date DATE NOT NULL,
--     position VARCHAR(255),
--     staff_role VARCHAR(50) CHECK (leave_status IN ('staff', 'nysc', 'intern')) DEFAULT 'active',
--     profile_picture_url VARCHAR(255),
--     leave_status VARCHAR(50) CHECK (leave_status IN ('active', 'on leave', 'pending approval', 'suspended')) DEFAULT 'active',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE staff (
    staff_id VARCHAR(50) PRIMARY KEY,
    last_name VARCHAR(255) NOT NULL,
    other_name VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255) UNIQUE NOT NULL,
    office_email VARCHAR(255) UNIQUE NOT NULL,
    join_date DATE NOT NULL,
    position VARCHAR(255),
    staff_role VARCHAR(50) CHECK (staff_role IN ('staff', 'nysc', 'intern')) DEFAULT 'staff',  
    leave_status VARCHAR(50) CHECK (leave_status IN ('active', 'on leave', 'pending approval', 'suspended')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE staff_documents (
    document_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(50) REFERENCES staff(staff_id) ON DELETE CASCADE,
    document_type VARCHAR(50) CHECK (document_type IN (
        'Employment_Letter', 'Guarantor_Form', 'Medical_Report', 
        'Certificates', 'Leave_Form', 'Queries_and_Responses', 
        'Confidentiality_Agreement', 'Curriculum_Vitae'
    )),
    document_url VARCHAR(255),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE staff_documents (
    document_id SERIAL PRIMARY KEY,  -- Unique identifier for each document
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,  -- Reference to the staff member; ensure matching data type
    document_type VARCHAR(50) CHECK (document_type IN (
        'Employment_Letter', 'Guarantor_Form', 'Medical_Report', 
        'Certificates', 'Leave_Form', 'Queries_and_Responses', 
        'Confidentiality_Agreement', 'Curriculum_Vitae'
    )),  -- Limited document types using CHECK constraint
    document_url VARCHAR(255),  -- URL or path to the document
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Automatically set the upload date when a document is added
);




-- Department data for department-specific communication
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) UNIQUE NOT NULL
);

-- Table to handle files specific to each user
CREATE TABLE staff_files (
    file_id SERIAL PRIMARY KEY,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks for each staff member
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(50) REFERENCES staff(staff_id) ON DELETE CASCADE,
    task_content TEXT NOT NULL,
    assignee_id VARCHAR(50) REFERENCES staff(staff_id) ON DELETE SET NULL, 
    priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    status VARCHAR(50) CHECK (status IN ('to_do', 'in_progress', 'completed')) DEFAULT 'to_do',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);





-- CREATE TABLE tasks (
--     task_id SERIAL PRIMARY KEY,
--     staff_id INT REFERENCES staff_signUp(id) ON DELETE CASCADE,
--     description TEXT,
--     priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high')),
--     due_date DATE,
--     status VARCHAR(50) CHECK (status IN ('to_do', 'in_progress', 'completed')) DEFAULT 'to_do',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     completed_at TIMESTAMP
-- );

-- Productivity tracking: counts completed tasks for each user
CREATE TABLE productivity (
    productivity_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES staff(staff_id) ON DELETE CASCADE,
    tasks_completed INT DEFAULT 0,
    productivity_score DECIMAL(5, 2) -- could be a calculated score
);

-- Reports sent to the Admin
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(50) REFERENCES staff(staff_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    attachment_url VARCHAR(255),
    sent_by VARCHAR(50) NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table for admin messages to staff
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE
);

-- Chat or messages between staff members
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES staff(staff_id) ON DELETE SET NULL,
    recipient_id INT REFERENCES staff(staff_id) ON DELETE SET NULL,
    channel_id INT REFERENCES channels(channel_id),
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Channels for group messages, department channels, or specific document threads
CREATE TABLE channels (
    channel_id SERIAL PRIMARY KEY,
    channel_name VARCHAR(255) NOT NULL,
    department_id INT REFERENCES departments(department_id) -- for department-based channels
);

-- Department-based communication for specific document threads
CREATE TABLE department_documents (
    document_id SERIAL PRIMARY KEY,
    document_name VARCHAR(255) NOT NULL,
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
    document_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication threads tied to specific documents
CREATE TABLE document_threads (
    thread_id SERIAL PRIMARY KEY,
    document_id INT REFERENCES department_documents(document_id) ON DELETE CASCADE,
    channel_id INT REFERENCES channels(channel_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests and query records for tracking employee queries and leave applications
CREATE TABLE leave_requests (
    request_id SERIAL PRIMARY KEY,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_description TEXT,
    status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- used
CREATE TABLE staff_leave (
    leave_id SERIAL PRIMARY KEY,  
    staff_id VARCHAR(255) NOT NULL,  
    leave_type VARCHAR(100) NOT NULL,  
    start_date DATE NOT NULL,  
    end_date DATE NOT NULL,  
    reason TEXT,  
    status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',  
    document_id INT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  

    FOREIGN KEY (staff_id) REFERENCES staff(staff_id), 
    FOREIGN KEY (document_id) REFERENCES staff_documents(document_id) 
);

CREATE TABLE staff_leave (
    leave_id SERIAL PRIMARY KEY,
    staff_id INT NOT NULL, -- Reference to the staff
    leave_type VARCHAR(100) NOT NULL, -- For example, annual leave, sick leave, etc.
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT, -- Reason for leave
    leave_status VARCHAR(50) DEFAULT 'Pending', -- Status of leave (Pending, Approved, Rejected)
    document_id INT, -- Foreign key for the document (if there is one)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
    FOREIGN KEY (document_id) REFERENCES documents(document_id) -- Assuming you have a 'documents' table
);


CREATE TABLE queries (
    query_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES staff(staff_id) ON DELETE CASCADE,
    query_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    query_content TEXT NOT NULL,
    response TEXT,
    document_id INT,
    resolved BOOLEAN DEFAULT FALSE,
     FOREIGN KEY (document_id) REFERENCES staff_documents(document_id)
);

-- used
CREATE TABLE queries (
    query_id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) REFERENCES staff(staff_id) ON DELETE CASCADE, 
    issued_by VARCHAR(255) REFERENCES staff(staff_id) ON DELETE SET NULL, 
    query_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    query_content TEXT NOT NULL, 
    response TEXT, 
    resolved BOOLEAN DEFAULT FALSE, 
    document_id INT REFERENCES staff_documents(document_id), 
    response_date TIMESTAMP 
);




-- Table for user authentication details (login credentials)
CREATE TABLE signUp_staff(
    id SERIAL PRIMARY KEY,
    staff_fullname VARCHAR(255) NOT NULL,
    staff_official_email VARCHAR(255) UNIQUE NOT NULL,
    staff_personal_email VARCHAR(255) UNIQUE NOT NULL,
    staff_department INT REFERENCES department(department_id),
    staff_role VARCHAR(255) NOT NULL,
    staff_password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);



CREATE TABLE auth_users (
    auth_user_id SERIAL PRIMARY KEY,
    staff_id INT REFERENCES staff(staff_id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Roles table to define roles like Admin, Staff, etc.
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

-- Link each user to a role
CREATE TABLE user_roles (
    user_role_id SERIAL PRIMARY KEY,
    auth_user_id INT REFERENCES auth_users(auth_user_id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE
);

-- Optional: Table for session management and tokens
CREATE TABLE user_sessions (
    session_id SERIAL PRIMARY KEY,
    auth_user_id INT REFERENCES auth_users(auth_user_id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL, -- Used for access tokens
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);


--Inserting Data 
INSERT INTO umera_departments (department_id, department_name) VALUES
('UMeRA-DPT-RD', 'Research & Development'),
('UMeRA-DPT-MD', 'Media'),
('UMeRA-DPT-AC', 'Accounting'),
('UMeRA-DPT-IT', 'Information Technology'),
('UMeRA-DPT-PF', 'Portfolio'),
('UMeRA-DPT-LG', 'Legal'),
('UMeRA-DPT-AD', 'Admin');


//Email

CREATE TABLE emails (
    email_id SERIAL PRIMARY KEY,
    email_address VARCHAR(255) UNIQUE NOT NULL,
    added_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP; -- Set updated_at to current time
    RETURN NEW; -- Return the modified row
END;
$$
 LANGUAGE plpgsql;

CREATE TRIGGER update_emails_timestamp
BEFORE UPDATE ON emails
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
    reset_token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

CREATE TABLE auth {
    id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
    hashed_password VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'normal',
    sent_by VARCHAR(255) NOT NULL REFERENCES staff(staff_id),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE celebrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    celebration_date DATE NOT NULL,
    celebration_type VARCHAR(50) DEFAULT 'General',
    added_by INTEGER NOT NULL REFERENCES staff(staff_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_public BOOLEAN DEFAULT TRUE
);

CREATE OR REPLACE FUNCTION add_birthday_to_celebrations()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO celebrations (
        title,
        description,
        celebration_date,
        added_by,
        celebration_type,
        is_public
    )
    VALUES (
        CONCAT(NEW.first_name, ' ', NEW.other_name),
        CONCAT('Celebrate ', NEW.first_name, ' ', NEW.other_name, '''s birthday!'),
        NEW.birth_date,
        NEW.staff_id, 
        'Birthday',
        TRUE
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_staff_insert_or_update
AFTER INSERT OR UPDATE OF birth_date ON staff
FOR EACH ROW
EXECUTE FUNCTION add_birthday_to_celebrations();

CREATE TABLE staff_images (
    id SERIAL PRIMARY KEY,
    staff_id VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE
);









