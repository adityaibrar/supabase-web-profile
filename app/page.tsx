'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, ChevronDown, Code, Smartphone, Database, Cloud, Award, Heart, User, GraduationCap, Briefcase, FolderOpen, Wrench, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [portfolioData, setPortfolioData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchPortfolioData();
    
    const handleScroll = () => {
      const sections = ['hero', 'about', 'education', 'experience', 'projects', 'skills', 'certifications', 'interests', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPortfolioData = async () => {
    try {
      // Get the first user's profile (for demo purposes)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (!profiles || profiles.length === 0) {
        setLoading(false);
        return;
      }

      const profile = profiles[0];
      const userId = profile.id;

      const [
        educationRes,
        experienceRes,
        projectRes,
        skillRes,
        certificationRes,
        interestRes
      ] = await Promise.all([
        supabase.from('education').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
        supabase.from('experiences').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
        supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', userId).order('category'),
        supabase.from('certifications').select('*').eq('user_id', userId).order('issue_date', { ascending: false }),
        supabase.from('interests').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      setPortfolioData({
        profile,
        education: educationRes.data || [],
        experiences: experienceRes.data || [],
        projects: projectRes.data || [],
        skills: skillRes.data || [],
        certifications: certificationRes.data || [],
        interests: interestRes.data || []
      });
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400">Loading portfolio...</div>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const profile = portfolioData.profile || {};
  const skillsByCategory = portfolioData.skills?.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {profile.full_name || 'DevPortfolio'}
            </div>
            <div className="hidden md:flex space-x-8">
              {['About', 'Education', 'Experience', 'Projects', 'Skills', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                    activeSection === item.toLowerCase() ? 'text-cyan-400' : 'text-gray-300'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.1),transparent_50%)]"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-fade-in">
              {profile.title || 'Flutter Developer'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up">
              {profile.bio || 'Computer Engineering Graduate • Mobile App Specialist • Cross-Platform Expert'}
            </p>
            <div className="flex justify-center space-x-6 mb-12">
              {profile.github_url && (
                <a href={profile.github_url} className="p-3 bg-gray-800/50 rounded-full hover:bg-cyan-500/20 transition-all duration-300 hover:scale-110">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} className="p-3 bg-gray-800/50 rounded-full hover:bg-cyan-500/20 transition-all duration-300 hover:scale-110">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="p-3 bg-gray-800/50 rounded-full hover:bg-cyan-500/20 transition-all duration-300 hover:scale-110">
                  <Mail className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
          
          <Button 
            onClick={() => scrollToSection('about')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
          >
            Explore My Work
          </Button>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                {profile.bio || 'Passionate Computer Engineering graduate with a specialized focus on Flutter development. I create beautiful, performant mobile applications that deliver exceptional user experiences across both iOS and Android platforms.'}
              </p>
              <div className="flex flex-wrap gap-4">
                {profile.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">{profile.location}</span>
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-300">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{portfolioData.projects?.length || 0}+</div>
                    <div className="text-gray-300">Projects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{portfolioData.experiences?.length || 0}+</div>
                    <div className="text-gray-300">Experience</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{Object.keys(skillsByCategory).length || 0}+</div>
                    <div className="text-gray-300">Skill Categories</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">{portfolioData.certifications?.length || 0}+</div>
                    <div className="text-gray-300">Certifications</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Education Section */}
      {portfolioData.education?.length > 0 && (
        <section id="education" className="py-20 px-6 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Education
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
            </div>
            
            <div className="space-y-8">
              {portfolioData.education.map((edu: any) => (
                <Card key={edu.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <GraduationCap className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{edu.degree}</h3>
                            <p className="text-cyan-400 font-medium">{edu.institution}</p>
                          </div>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {edu.start_date} - {edu.end_date || 'Present'}
                          </Badge>
                        </div>
                        {edu.description && (
                          <p className="text-gray-300 mb-4">{edu.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {edu.gpa && (
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300">GPA: {edu.gpa}</Badge>
                          )}
                          {edu.achievements?.map((achievement: string, index: number) => (
                            <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {portfolioData.experiences?.length > 0 && (
        <section id="experience" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Experience
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
            </div>
            
            <div className="space-y-8">
              {portfolioData.experiences.map((exp: any) => (
                <Card key={exp.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <Briefcase className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">{exp.title}</h3>
                            <p className="text-cyan-400 font-medium">{exp.company}</p>
                          </div>
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {exp.start_date} - {exp.end_date || 'Present'}
                          </Badge>
                        </div>
                        {exp.description && (
                          <p className="text-gray-300 mb-4">{exp.description}</p>
                        )}
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {portfolioData.projects?.length > 0 && (
        <section id="projects" className="py-20 px-6 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData.projects.map((project: any) => (
                <Card key={project.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 group hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FolderOpen className="w-8 h-8 text-cyan-400" />
                      <div className="flex space-x-2">
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-5 h-5 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" />
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-5 h-5 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors" />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400">Featured</Badge>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      {Object.keys(skillsByCategory).length > 0 && (
        <section id="skills" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Skills & Technologies
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(skillsByCategory).map(([category, skills]: [string, any]) => (
                <Card key={category} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-4 rounded-lg mb-4 bg-cyan-500/20">
                      <Code className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4">{category}</h3>
                    <div className="space-y-2">
                      {skills.map((skill: any) => (
                        <div key={skill.id} className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">{skill.name}</span>
                          <div className="flex space-x-1">
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
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {portfolioData.certifications?.length > 0 && (
        <section id="certifications" className="py-20 px-6 bg-gray-900/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Certifications
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {portfolioData.certifications.map((cert: any) => (
                <Card key={cert.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <Award className="w-8 h-8 text-cyan-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{cert.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{cert.issuer}</p>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                            {cert.issue_date}
                          </Badge>
                          {cert.credential_url && (
                            <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline text-sm">
                              View Credential
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interests Section */}
      {portfolioData.interests?.length > 0 && (
        <section id="interests" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Interests & Hobbies
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {portfolioData.interests.map((interest: any) => (
                <Card key={interest.id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300 group text-center">
                  <CardContent className="p-8">
                    <div className="inline-flex p-4 rounded-lg mb-4 bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-all duration-300">
                      <Heart className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{interest.title}</h3>
                    {interest.description && (
                      <p className="text-gray-300">{interest.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">
              Ready to bring your mobile app ideas to life? Let's discuss your next project.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {profile.email && (
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-cyan-500/20 rounded-lg">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-gray-300">{profile.email}</p>
                  </div>
                </div>
              )}
              
              {profile.phone && (
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Phone</h3>
                    <p className="text-gray-300">{profile.phone}</p>
                  </div>
                </div>
              )}
              
              {profile.location && (
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Location</h3>
                    <p className="text-gray-300">{profile.location}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div>
                    <Input
                      placeholder="Your Name"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Subject"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your message..."
                      rows={5}
                      className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400 resize-none"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transition-all duration-300 hover:scale-105">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                {profile.full_name || 'Flutter Developer Portfolio'}
              </div>
              <p className="text-gray-400">Building the future, one app at a time.</p>
            </div>
            <div className="flex space-x-6">
              {profile.github_url && (
                <a href={profile.github_url} className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © 2024 {profile.full_name || 'Flutter Developer Portfolio'}. Built with Next.js and Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}