import React, { useState, useRef } from 'react';
import { PoliceStation, UserProfile } from '../types';
import { POLICE_STATIONS } from '../constants';
import { Button, Input, Select, Card, FadeIn } from './UiComponents';
import { generateAiBio } from '../services/geminiService';
import { Camera, Sparkles, MapPin, ChevronRight, ChevronLeft, User, X, Info } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  // Steps: 0 = Basic Info (Name, Age, Gender, Location), 1 = Bio & Photos
  const [step, setStep] = useState<0 | 1>(0);
  
  // Basic Info State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [selectedPS, setSelectedPS] = useState<PoliceStation | ''>('');
  
  // Profile Enhancement State
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateBio = async () => {
    if (!name || !interests) {
      alert("Please enter some interests first!");
      return;
    }
    setIsGeneratingBio(true);
    try {
      const generated = await generateAiBio(interests, selectedPS, name);
      setBio(generated);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleSubmit = () => {
    if (photos.length < 1) {
      alert("Please upload at least 1 photo to continue.");
      return;
    }
    
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      age: parseInt(age),
      gender,
      policeStation: selectedPS as PoliceStation,
      bio,
      interests: interests.split(',').map(i => i.trim()).filter(i => i !== ''),
      photos,
    };

    // Persist current user session locally
    localStorage.setItem('malda_mingle_user', JSON.stringify(profile));
    onComplete(profile);
  };

  // Step 0: Basic Information
  if (step === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <FadeIn className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl text-brand-primary shadow-xl shadow-orange-500/10 mb-6 animate-float border border-slate-100">
              <User size={32} />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
              Tell us about yourself
            </h1>
            <p className="text-slate-500">
              Just a few details to get you started in Malda.
            </p>
          </div>

          <Card className="p-8 space-y-6">
            <Input 
              label="Full Name" 
              placeholder="e.g. Rahul Roy"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <div className="flex gap-4">
              <Input 
                label="Age" 
                type="number" 
                placeholder="24"
                className="w-full"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
              />
              <Select 
                label="Gender"
                options={['Male', 'Female', 'Other']}
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              />
            </div>

            <Select 
              label="Local Area (Police Station)" 
              options={POLICE_STATIONS} 
              value={selectedPS}
              onChange={(e) => setSelectedPS(e.target.value as PoliceStation)}
            />

            <Button 
              className="w-full text-lg py-3.5" 
              onClick={() => setStep(1)}
              disabled={!name || !age || !selectedPS || parseInt(age) < 18}
              icon={<ChevronRight size={20} />}
            >
              Continue
            </Button>
            
            {parseInt(age) < 18 && age !== '' && (
              <p className="text-[10px] text-red-500 text-center font-bold uppercase tracking-widest">
                You must be 18+ to join
              </p>
            )}
          </Card>
        </FadeIn>
      </div>
    );
  }

  // Step 1: Bio, Interests, and Photos
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white sticky top-0 z-10 border-b border-slate-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => setStep(0)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-slate-600"/>
        </button>
        <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden">
           <div className="h-full w-full bg-gradient-brand rounded-full"></div>
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase">Final Touches</span>
      </div>

      <FadeIn className="max-w-lg mx-auto w-full p-6">
        <div className="mb-8">
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Enhance Profile</h2>
           <p className="text-slate-500">Add some personality to your profile.</p>
        </div>

        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <Input 
              label="Interests (comma separated)" 
              placeholder="Cricket, Mangoes, Music..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
                 <button 
                   type="button" 
                   onClick={handleGenerateBio}
                   disabled={!interests || isGeneratingBio}
                   className="text-xs font-semibold text-brand-secondary flex items-center gap-1 hover:text-orange-600 transition-colors disabled:opacity-50"
                 >
                   <Sparkles size={14} /> {isGeneratingBio ? 'Writing...' : 'AI Bio'}
                 </button>
              </div>
              <textarea 
                className="bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary focus:outline-none transition-all min-h-[100px] resize-none"
                placeholder="Tell Malda about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </Card>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
               <span>Photos</span>
               <span className={`${photos.length >= 1 ? 'text-green-500' : 'text-slate-400'}`}>{photos.length}/4 (Min 1)</span>
            </label>
            <div className="grid grid-cols-4 gap-3">
              {photos.map((src, idx) => (
                <div key={idx} className="aspect-[3/4] rounded-xl overflow-hidden relative group shadow-sm">
                  <img src={src} alt="preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-100 transition-all hover:bg-red-500"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[3/4] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-brand-secondary hover:text-brand-secondary hover:bg-orange-50 transition-all gap-2 group"
                >
                  <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white transition-colors">
                    <Camera size={20} />
                  </div>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>

          <div className="pt-4">
            <Button 
              className="w-full text-lg py-4 shadow-xl shadow-orange-500/20" 
              onClick={handleSubmit}
              disabled={photos.length < 1}
            >
              Start Mingling
            </Button>
            <p className="mt-4 text-center text-[10px] text-slate-400 font-medium leading-relaxed">
              By clicking Start Mingling, you agree to follow community guidelines and be respectful to others in Malda District.
            </p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};