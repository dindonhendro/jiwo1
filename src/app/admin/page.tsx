"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Settings,
  FileText,
  GraduationCap,
  Briefcase,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Save,
  X
} from "lucide-react";
import { createClient } from "../../../supabase/client";
import { useRouter } from "next/navigation";

interface Professional {
  id: string;
  name: string;
  specialty: string;
  treatment_type: string;
  avatar: string;
  bio: string;
  experience_years: number;
  rating: number;
  price_per_session: number;
  available_online: boolean;
  available_offline: boolean;
  languages: string[];
  cv_data?: any;
  education?: string[];
  certifications?: string[];
  work_experience?: any[];
  skills?: string[];
  is_active: boolean;
  admin_notes?: string;
}

interface YogaVendor {
  id: string;
  name: string;
  description: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  services: string[];
  pricing: any;
  rating: number;
  images: string[];
  is_active: boolean;
  admin_notes?: string;
}

export default function AdminDashboard() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [yogaVendors, setYogaVendors] = useState<YogaVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<YogaVendor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAdminAccess();
    loadData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!adminUser) {
        alert('Access denied. Admin privileges required.');
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/dashboard');
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load professionals
      const { data: profData, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (profError) throw profError;
      setProfessionals(profData || []);

      // Load yoga vendors
      const { data: vendorData, error: vendorError } = await supabase
        .from('yoga_vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (vendorError) throw vendorError;
      setYogaVendors(vendorData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setEditForm({
      name: professional.name,
      specialty: professional.specialty,
      bio: professional.bio,
      experience_years: professional.experience_years,
      price_per_session: professional.price_per_session,
      available_online: professional.available_online,
      available_offline: professional.available_offline,
      languages: professional.languages.join(', '),
      education: professional.education?.join('\n') || '',
      certifications: professional.certifications?.join('\n') || '',
      skills: professional.skills?.join(', ') || '',
      is_active: professional.is_active,
      admin_notes: professional.admin_notes || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfessional = async () => {
    if (!selectedProfessional) return;

    try {
      const updateData = {
        name: editForm.name,
        specialty: editForm.specialty,
        bio: editForm.bio,
        experience_years: parseInt(editForm.experience_years),
        price_per_session: parseInt(editForm.price_per_session),
        available_online: editForm.available_online,
        available_offline: editForm.available_offline,
        languages: editForm.languages.split(',').map((l: string) => l.trim()),
        education: editForm.education.split('\n').filter((e: string) => e.trim()),
        certifications: editForm.certifications.split('\n').filter((c: string) => c.trim()),
        skills: editForm.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s),
        is_active: editForm.is_active,
        admin_notes: editForm.admin_notes
      };

      const { error } = await supabase
        .from('professionals')
        .update(updateData)
        .eq('id', selectedProfessional.id);

      if (error) throw error;

      alert('Professional updated successfully!');
      setIsEditing(false);
      setSelectedProfessional(null);
      loadData();
    } catch (error) {
      console.error('Error updating professional:', error);
      alert('Failed to update professional');
    }
  };

  const handleDeleteProfessional = async (id: string) => {
    if (!confirm('Are you sure you want to delete this professional?')) return;

    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Professional deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Error deleting professional:', error);
      alert('Failed to delete professional');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage professionals, yoga vendors, and platform content</p>
        </div>

        <Tabs defaultValue="professionals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="professionals">Professionals ({professionals.length})</TabsTrigger>
            <TabsTrigger value="yoga-vendors">Yoga Vendors ({yogaVendors.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Professionals</h2>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Professional
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {professionals.map((professional) => (
                <Card key={professional.id} className={`${!professional.is_active ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={professional.avatar} />
                          <AvatarFallback>{professional.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{professional.name}</CardTitle>
                          <CardDescription className="text-sm">{professional.specialty}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={professional.is_active ? "secondary" : "destructive"}>
                        {professional.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Experience:</span>
                      <span>{professional.experience_years} years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1">{professional.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Price:</span>
                      <span>{formatPrice(professional.price_per_session)}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View CV
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{professional.name} - Complete CV</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Professional Summary */}
                            <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                Professional Summary
                              </h3>
                              <p className="text-gray-700">{professional.bio}</p>
                            </div>

                            {/* Education */}
                            {professional.education && professional.education.length > 0 && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                  <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                                  Education
                                </h3>
                                <div className="space-y-2">
                                  {professional.education.map((edu, index) => (
                                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                      <p className="font-medium text-gray-800">{edu}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Work Experience */}
                            {professional.work_experience && professional.work_experience.length > 0 && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                  <Briefcase className="w-5 h-5 mr-2 text-orange-600" />
                                  Work Experience
                                </h3>
                                <div className="space-y-4">
                                  {professional.work_experience.map((exp, index) => (
                                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-800">{exp.position}</h4>
                                        <Badge variant="outline" className="text-xs">{exp.duration}</Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-1">{exp.organization}</p>
                                      <p className="text-sm text-gray-700">{exp.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Admin Notes */}
                            {professional.admin_notes && (
                              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h4 className="font-medium text-yellow-800 mb-2">Admin Notes</h4>
                                <p className="text-sm text-yellow-700">{professional.admin_notes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditProfessional(professional)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>

                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteProfessional(professional.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Yoga Vendors Tab */}
          <TabsContent value="yoga-vendors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Yoga Vendors</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {yogaVendors.map((vendor) => (
                <Card key={vendor.id} className={`${!vendor.is_active ? 'opacity-60' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription className="text-sm flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {vendor.location}
                        </CardDescription>
                      </div>
                      <Badge variant={vendor.is_active ? "secondary" : "destructive"}>
                        {vendor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{vendor.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span>Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1">{vendor.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{vendor.contact_email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{vendor.contact_phone}</span>
                      </div>
                      {vendor.website && (
                        <div className="flex items-center text-sm">
                          <Globe className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{vendor.website}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {vendor.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {vendor.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Admin Settings
                </CardTitle>
                <CardDescription>
                  Manage platform settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Admin settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Professional Dialog */}
        {isEditing && selectedProfessional && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Professional - {selectedProfessional.name}</DialogTitle>
                <DialogDescription>
                  Update professional information and CV details
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Specialty</Label>
                    <Input
                      id="specialty"
                      value={editForm.specialty}
                      onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={editForm.experience_years}
                      onChange={(e) => setEditForm({...editForm, experience_years: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Session</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editForm.price_per_session}
                      onChange={(e) => setEditForm({...editForm, price_per_session: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <Input
                    id="languages"
                    value={editForm.languages}
                    onChange={(e) => setEditForm({...editForm, languages: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="education">Education (one per line)</Label>
                  <Textarea
                    id="education"
                    value={editForm.education}
                    onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications (one per line)</Label>
                  <Textarea
                    id="certifications"
                    value={editForm.certifications}
                    onChange={(e) => setEditForm({...editForm, certifications: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    value={editForm.skills}
                    onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="online"
                      checked={editForm.available_online}
                      onChange={(e) => setEditForm({...editForm, available_online: e.target.checked})}
                    />
                    <Label htmlFor="online">Available Online</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="offline"
                      checked={editForm.available_offline}
                      onChange={(e) => setEditForm({...editForm, available_offline: e.target.checked})}
                    />
                    <Label htmlFor="offline">Available Offline</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="active"
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="admin_notes">Admin Notes</Label>
                  <Textarea
                    id="admin_notes"
                    value={editForm.admin_notes}
                    onChange={(e) => setEditForm({...editForm, admin_notes: e.target.value})}
                    rows={3}
                    placeholder="Internal notes for admin use..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={handleSaveProfessional} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}