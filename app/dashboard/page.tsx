'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  FolderOpen, 
  Award, 
  Heart, 
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import ProfileForm from '@/components/dashboard/ProfileForm';
import EducationForm from '@/components/dashboard/EducationForm';
import ExperienceForm from '@/components/dashboard/ExperienceForm';
import ProjectForm from '@/components/dashboard/ProjectForm';
import SkillForm from '@/components/dashboard/SkillForm';
import CertificationForm from '@/components/dashboard/CertificationForm';
import InterestForm from '@/components/dashboard/InterestForm';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState<any>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    if (!user) return;
    
    setLoadingData(true);
    
    try {
      const [
        profileRes,
        educationRes,
        experienceRes,
        projectRes,
        skillRes,
        certificationRes,
        interestRes
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', user.id).order('category'),
        supabase.from('certifications').select('*').eq('user_id', user.id).order('issue_date', { ascending: false }),
        supabase.from('interests').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      setData({
        profile: profileRes.data,
        education: educationRes.data || [],
        experiences: experienceRes.data || [],
        projects: projectRes.data || [],
        skills: skillRes.data || [],
        certifications: certificationRes.data || [],
        interests: interestRes.data || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    const { error } = await supabase.from(table).delete().eq('id', id);
    
    if (!error) {
      fetchAllData();
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Portfolio Dashboard
              </h1>
              <p className="text-gray-400">Welcome back, {data.profile?.full_name || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-cyan-500/20 hover:border-cyan-500"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-red-500/20 hover:border-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800/50 mb-8">
            <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <GraduationCap className="w-4 h-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Briefcase className="w-4 h-4 mr-2" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Settings className="w-4 h-4 mr-2" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Award className="w-4 h-4 mr-2" />
              Certificates
            </TabsTrigger>
            <TabsTrigger value="interests" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Heart className="w-4 h-4 mr-2" />
              Interests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-cyan-400">Profile Information</CardTitle>
                <CardDescription>Manage your personal information and social links</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm profile={data.profile} onUpdate={fetchAllData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">Education</h2>
                  <p className="text-gray-400">Manage your educational background</p>
                </div>
                <EducationForm onUpdate={fetchAllData} />
              </div>
              
              <div className="grid gap-4">
                {data.education?.map((edu: any) => (
                  <Card key={edu.id} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                          <p className="text-cyan-400 font-medium">{edu.institution}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {edu.start_date} - {edu.end_date || 'Present'}
                          </p>
                          {edu.description && (
                            <p className="text-gray-300 mt-2">{edu.description}</p>
                          )}
                          {edu.gpa && (
                            <Badge className="mt-2 bg-cyan-500/20 text-cyan-400">GPA: {edu.gpa}</Badge>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <EducationForm education={edu} onUpdate={fetchAllData} />
                          <Button
                            onClick={() => handleDelete('education', edu.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-800 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experience">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">Experience</h2>
                  <p className="text-gray-400">Manage your work experience</p>
                </div>
                <ExperienceForm onUpdate={fetchAllData} />
              </div>
              
              <div className="grid gap-4">
                {data.experiences?.map((exp: any) => (
                  <Card key={exp.id} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                          <p className="text-cyan-400 font-medium">{exp.company}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {exp.start_date} - {exp.end_date || 'Present'}
                          </p>
                          {exp.description && (
                            <p className="text-gray-300 mt-2">{exp.description}</p>
                          )}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {exp.technologies.map((tech: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <ExperienceForm experience={exp} onUpdate={fetchAllData} />
                          <Button
                            onClick={() => handleDelete('experiences', exp.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-800 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">Projects</h2>
                  <p className="text-gray-400">Showcase your work and projects</p>
                </div>
                <ProjectForm onUpdate={fetchAllData} />
              </div>
              
              <div className="grid gap-4">
                {data.projects?.map((project: any) => (
                  <Card key={project.id} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                            {project.featured && (
                              <Badge className="bg-yellow-500/20 text-yellow-400">Featured</Badge>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-gray-300 mt-2">{project.description}</p>
                          )}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {project.technologies.map((tech: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-4 mt-3">
                            {project.github_url && (
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm">
                                GitHub
                              </a>
                            )}
                            {project.demo_url && (
                              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm">
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <ProjectForm project={project} onUpdate={fetchAllData} />
                          <Button
                            onClick={() => handleDelete('projects', project.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-800 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">Skills</h2>
                  <p className="text-gray-400">Manage your technical skills</p>
                </div>
                <SkillForm onUpdate={fetchAllData} />
              </div>
              
              <div className="grid gap-4">
                {Object.entries(
                  data.skills?.reduce((acc: any, skill: any) => {
                    if (!acc[skill.category]) acc[skill.category] = [];
                    acc[skill.category].push(skill);
                    return acc;
                  }, {}) || {}
                ).map(([category, skills]: [string, any]) => (
                  <Card key={category} className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg text-cyan-400">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {skills.map((skill: any) => (
                          <div key={skill.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-white">{skill.name}</span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < skill.level ? 'bg-cyan-400' : 'bg-gray-600'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <SkillForm skill={skill} onUpdate={fetchAllData} />
                              <Button
                                onClick={() => handleDelete('skills', skill.id)}
                                size="sm"
                                variant="outline"
                                className="border-red-800 text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">Certifications</h2>
                  <p className="text-gray-400">Manage your professional certifications</p>
                </div>
                <CertificationForm onUpdate={fetchAllData} />
              </div>
              
              <div className="grid gap-4">
                {data.certifications?.map((cert: any) => (
                  <Card key={cert.id} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{cert.title}</h3>
                          <p className="text-cyan-400 font-medium">{cert.issuer}</p>
                          <p className="text-gray-400 text-sm mt-1">{cert.issue_date}</p>
                          {cert.credential_url && (
                            <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm mt-2 inline-block">
                              View Credential
                            </a>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <CertificationForm certification={cert} onUpdate={fetchAllData} />
                          <Button
                            onClick={() => handleDelete('certifications', cert.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-800 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interests">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400">Interests</h2>
                  <p className="text-gray-400">Share your hobbies and interests</p>
                </div>
                <InterestForm onUpdate={fetchAllData} />
              </div>
              
              <div className="grid gap-4">
                {data.interests?.map((interest: any) => (
                  <Card key={interest.id} className="bg-gray-900/50 border-gray-800">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{interest.title}</h3>
                          {interest.description && (
                            <p className="text-gray-300 mt-2">{interest.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <InterestForm interest={interest} onUpdate={fetchAllData} />
                          <Button
                            onClick={() => handleDelete('interests', interest.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-800 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}