CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lastCompleted INT NOT NULL DEFAULT 0,
)

CREATE TABLE components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(255) NOT NULL,
    level INT NOT NULL,
)

CREATE TABLE flow_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flowId UUID REFERENCES flows(id),
    componentId UUID REFERENCES components(id),
    order INT NOT NULL,
    CONSTRAINT unique_flow_component UNIQUE (flowId, componentId, order)
)

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth(id),
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    occupation VARCHAR(255) NOT NULL,
    major VARCHAR(255) NOT NULL,
    nativeLanguage VARCHAR(255) NOT NULL,
    flowId UUID UNIQUE REFERENCES flows(id),
    createdAt TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE intrests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
);

CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field VARCHAR(255) NOT NULL,
    topicName VARCHAR(255) NOT NULL,
    level INT NOT NULL,
    CONSTRAINT unique_field_topicname UNIQUE (field, topicName)
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topicId UUID REFERENCES topics(id),
    userId UUID REFERENCES users(id),
    date TIMESTAMPTZ DEFAULT now(),
    type VARCHAR(255) NOT NULL,
    userText TEXT NOT NULL
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reportId UUID REFERENCES reports(id),
    wrongText TEXT NOT NULL,
    rightText TEXT NOT NULL,
    info TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word VARCHAR(255) NOT NULL,
    meaning TEXT NOT NULL,
    example TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now()
)

CREATE TABLE userNotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    heading VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now()
)

CREATE TABLE userIntrests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    intrestId UUID REFERENCES intrests(id)
);

CREATE TABLE userTopics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    topicId UUID REFERENCES topics(id)
);

CREATE TABLE userWords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    wordId UUID REFERENCES words(id)
);