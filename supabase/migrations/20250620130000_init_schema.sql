/*
  # Portfolio Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `title` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `phone` (text)
      - `location` (text)
      - `github_url` (text)
      - `linkedin_url` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `education`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `degree` (text)
      - `institution` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `description` (text)
      - `gpa` (text)
      - `achievements` (text[])
      - `created_at` (timestamp)

    - `experiences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `company` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `description` (text)
      - `technologies` (text[])
      - `created_at` (timestamp)

    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `technologies` (text[])
      - `github_url` (text)
      - `demo_url` (text)
      - `image_url` (text)
      - `featured` (boolean)
      - `created_at` (timestamp)

    - `skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `category` (text)
      - `name` (text)
      - `level` (integer)
      - `created_at` (timestamp)

    - `certifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `issuer` (text)
      - `issue_date` (date)
      - `credential_url` (text)
      - `created_at` (timestamp)

    - `interests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  title text,
  bio text,
  avatar_url text,
  phone text,
  location text,
  github_url text,
  linkedin_url text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  degree text NOT NULL,
  institution text NOT NULL,
  start_date date,
  end_date date,
  description text,
  gpa text,
  achievements text[],
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  start_date date,
  end_date date,
  description text,
  technologies text[],
  created_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  technologies text[],
  github_url text,
  demo_url text,
  image_url text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  name text NOT NULL,
  level integer DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  created_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  issuer text NOT NULL,
  issue_date date,
  credential_url text,
  created_at timestamptz DEFAULT now()
);

-- Create interests table
CREATE TABLE IF NOT EXISTS interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for education
CREATE POLICY "Users can manage own education"
  ON education
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Education is viewable by everyone"
  ON education
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for experiences
CREATE POLICY "Users can manage own experiences"
  ON experiences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Experiences are viewable by everyone"
  ON experiences
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for projects
CREATE POLICY "Users can manage own projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Projects are viewable by everyone"
  ON projects
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for skills
CREATE POLICY "Users can manage own skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Skills are viewable by everyone"
  ON skills
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for certifications
CREATE POLICY "Users can manage own certifications"
  ON certifications
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Certifications are viewable by everyone"
  ON certifications
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for interests
CREATE POLICY "Users can manage own interests"
  ON interests
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Interests are viewable by everyone"
  ON interests
  FOR SELECT
  TO anon
  USING (true);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();