'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Edit } from 'lucide-react';

interface ProjectFormProps {
  project?: any;
  onUpdate: () => void;
}

export default function ProjectForm({ project, onUpdate }: ProjectFormProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    technologies: project?.technologies?.join(', ') || '',
    github_url: project?.github_url || '',
    demo_url: project?.demo_url || '',
    image_url: project?.image_url || '',
    featured: project?.featured || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const technologiesArray = formData.technologies
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const data = {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        technologies: technologiesArray.length > 0 ? technologiesArray : null,
        github_url: formData.github_url || null,
        demo_url: formData.demo_url || null,
        image_url: formData.image_url || null,
        featured: formData.featured,
      };

      let error;
      if (project) {
        ({ error } = await supabase
          .from('projects')
          .update(data)
          .eq('id', project.id));
      } else {
        ({ error } = await supabase
          .from('projects')
          .insert([data]));
      }

      if (error) throw error;

      setOpen(false);
      onUpdate();
      
      if (!project) {
        setFormData({
          title: '',
          description: '',
          technologies: '',
          github_url: '',
          demo_url: '',
          image_url: '',
          featured: false,
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
        >
          {project ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />}
          {project ? '' : 'Add Project'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">
            {project ? 'Edit Project' : 'Add Project'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-300">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="My Awesome App"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Describe your project..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies" className="text-gray-300">Technologies</Label>
            <Input
              id="technologies"
              value={formData.technologies}
              onChange={(e) => handleChange('technologies', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="Flutter, Firebase, REST API (comma separated)"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => handleChange('github_url', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo_url" className="text-gray-300">Demo URL</Label>
              <Input
                id="demo_url"
                value={formData.demo_url}
                onChange={(e) => handleChange('demo_url', e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                placeholder="https://myapp.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-gray-300">Image URL</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
              placeholder="https://example.com/project-image.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleChange('featured', checked as boolean)}
              className="border-gray-700 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
            />
            <Label htmlFor="featured" className="text-gray-300">Featured Project</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}