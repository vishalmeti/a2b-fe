"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Users, ArrowLeft, Check, Plus, MapPin, AlertCircle, Navigation } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import NavBar from "@/components/NavBar";
import LoadingScreen from "@/components/loader/LoadingScreen";
import { Community } from "@/types/community";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { CommunityDetails } from "@/components/communities/CommunityDetails";
import { CommunityHeader } from "@/components/communities/CommunityHeader";
import { CommunityLocation } from "@/components/communities/CommunityLocation";
import { CommunityStats } from "@/components/communities/CommunityStats";
import { CommunityRules } from "@/components/communities/CommunityRules";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiService } from "@/services/apiService";
import { UserRepository } from "@/repositories/User";

const placeholderCommunities: Community[] = [
    {
        id: '1',
        name: 'Student Equipment Exchange',
        description: 'Share and borrow academic resources, lab equipment, and study materials.',
        longDescription: 'A community dedicated to helping students access educational resources through sharing. From textbooks to calculators, lab equipment to study guides - find what you need or help others in their academic journey.',
        memberCount: 3200,
        imageUrl: 'https://via.placeholder.com/100/88ddff/000000?text=SEE',
        tags: ['Education', 'Equipment', 'Books'],
        stats: {
            activeBorrows: 145,
            totalItemsShared: 850,
            successfulTransactions: 2300,
            averageRating: 4.8
        },
        rules: [
            'Return items in the same condition',
            'Respond to requests within 24 hours',
            'Report any damages immediately'
        ],
        location: 'University District',
        coordinates: {
            lat: 47.6062,
            lng: -122.3321
        }
    },
    {
        id: '2',
        name: 'DIY Tool Library',
        description: 'Community-driven tool sharing for home improvement and crafts projects.',
        longDescription: 'Share your tools and borrow what you need for your next DIY project. From power tools to gardening equipment, our community helps reduce waste and costs while promoting sustainable consumption.',
        memberCount: 5600,
        imageUrl: 'https://via.placeholder.com/100/a3e6b3/000000?text=DIY',
        tags: ['Tools', 'DIY', 'Home Improvement'],
        stats: {
            activeBorrows: 230,
            totalItemsShared: 1200,
            successfulTransactions: 4500,
            averageRating: 4.6
        },
        rules: [
            'Clean tools before returning',
            'Maximum borrow period: 7 days',
            'Safety first - wear appropriate gear'
        ],
        location: 'Bangalore India',
        coordinates:{
            lng: 77.594566,
            lat: 12.971599
        }
        
    },
    {
        id: '3',
        name: 'Tech Gadget Exchange',
        description: 'Try before you buy - share and experience latest tech gadgets.',
        longDescription: 'Exchange and try out the latest tech gadgets. Perfect for tech enthusiasts who want to test devices before making a purchase or share their collection with others.',
        memberCount: 2800,
        imageUrl: 'https://via.placeholder.com/100/d8b4fe/000000?text=Tech',
        tags: ['Technology', 'Gadgets', 'Electronics'],
        stats: {
            activeBorrows: 89,
            totalItemsShared: 450,
            successfulTransactions: 1200,
            averageRating: 4.9
        },
        rules: [
            'Insurance required for items over $500',
            'Document item condition with photos',
            'Return with original packaging'
        ],
        location: 'Thoraipakkam Chennai',
        coordinates: {
            lat: 13.0211,
            lng: 80.2455
        }
    }
];

// Define type for the form state
interface SuggestionFormState {
    name: string;
    city: string;
    pincode: string;
    latitude: string;
    longitude: string;
    description: string;
}

const CommunityBrowser = () => {
    const [communities] = useState<Community[]>(placeholderCommunities); // Replace with data fetching
    const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
    const [joinedCommunityIds, setJoinedCommunityIds] = useState<Set<string>>(new Set(['2']));
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    // Form state for community suggestion
    const [suggestionForm, setSuggestionForm] = useState<SuggestionFormState>({
        name: '',
        city: '',
        pincode: '',
        latitude: '',
        longitude: '',
        description: ''
    });
    
    // Form errors
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Map related state
    const [showMap, setShowMap] = useState(true); // Always show map
    const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]); // Default to Bangalore

    useEffect(() => {
        // Initial loading simulation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Update map center when latitude/longitude changes
        const lat = parseFloat(suggestionForm.latitude);
        const lng = parseFloat(suggestionForm.longitude);
        
        // Update map center if valid coordinates are present
        if (!isNaN(lat) && !isNaN(lng) && suggestionForm.latitude.trim() !== '' && suggestionForm.longitude.trim() !== '') {
            setMapCenter([lat, lng]);
        }
    }, [suggestionForm.latitude, suggestionForm.longitude]);

    const selectedCommunity = communities.find(c => c.id === selectedCommunityId);
    const isMember = selectedCommunity ? joinedCommunityIds.has(selectedCommunity.id) : false;

    const handleSelectCommunity = (id: string) => {
        setIsDetailLoading(true);
        setSelectedCommunityId(id);
        window.scrollTo(0, 0);
        // Simulate loading delay for detail view
        setTimeout(() => {
            setIsDetailLoading(false);
        }, 3000);
    };

    const handleGoBack = () => {
        setSelectedCommunityId(null);
    };

    const handleJoinToggle = (id: string) => {
        setJoinedCommunityIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                console.log(`Left community ${id}`);
            } else {
                newSet.add(id);
                console.log(`Joined community ${id}`);
            }
            return newSet;
        });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSuggestionForm(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Update map when coordinates change
        if (name === 'latitude' || name === 'longitude') {
            // Get updated lat/long values (use the new value for the changing field)
            const latValue = name === 'latitude' ? value : suggestionForm.latitude;
            const lngValue = name === 'longitude' ? value : suggestionForm.longitude;
            
            const lat = parseFloat(latValue);
            const lng = parseFloat(lngValue);
            
            // Only show map if both are valid numbers and non-empty strings
            if (!isNaN(lat) && !isNaN(lng) && latValue.trim() !== '' && lngValue.trim() !== '') {
                setMapCenter([lat, lng]);
            }
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!suggestionForm.name.trim()) {
            errors.name = 'Community name is required';
        }
        
        if (!suggestionForm.city.trim()) {
            errors.city = 'City is required';
        }
        
        if (!suggestionForm.pincode.trim()) {
            errors.pincode = 'Pincode is required';
        } else if (!/^\d{5,6}$/.test(suggestionForm.pincode.trim())) {
            errors.pincode = 'Please enter a valid pincode';
        }
        
        if (suggestionForm.latitude && !/^-?\d{1,3}(\.\d{1,7})?$/.test(suggestionForm.latitude)) {
            errors.latitude = 'Please enter a valid latitude';
        }
        
        if (suggestionForm.longitude && !/^-?\d{1,3}(\.\d{1,7})?$/.test(suggestionForm.longitude)) {
            errors.longitude = 'Please enter a valid longitude';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitSuggestion = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Call the API to submit community suggestion
            const communityData = {
                suggested_name: suggestionForm.name,
                city: suggestionForm.city,
                pincode: suggestionForm.pincode,
                latitude: suggestionForm.latitude,
                longitude: suggestionForm.longitude,
                description: suggestionForm.description || '',
            };

            await apiService.post(UserRepository.SUGGEST_COMMUNITIES, communityData);
            
            // Reset form and close modal
            setSuggestionForm({
                name: '',
                city: '',
                pincode: '',
                latitude: '',
                longitude: '',
                description: ''
            });
            
            setIsModalOpen(false);
            
            toast({
                variant: "success",
                title: "Community suggestion submitted",
                description: "Thank you! We'll review your suggestion soon.",
                duration: 5000,
            });
        } catch (error) {
            toast({
                title: "Error submitting suggestion",
                description: "Please try again later.",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <LoadingScreen baseMessage="Loading Communities" />;
    }

    if (isDetailLoading) {
        return <LoadingScreen baseMessage="Loading Community Details" />;
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto py-8 px-4 md:px-6">
                {selectedCommunity ? (
                    <motion.div
                        key={selectedCommunity.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        <Button variant="ghost" onClick={handleGoBack} className="group mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back 
                        </Button>

                        <CommunityHeader community={selectedCommunity} isMember={isMember} onJoinToggle={handleJoinToggle} />
                        
                        <div className="flex flex-col-reverse sm:flex-row gap-6">
                            {selectedCommunity.location && (
                                <CommunityLocation community={selectedCommunity} />
                            )}
                            {selectedCommunity.longDescription && (
                                <CommunityDetails community={selectedCommunity} />
                            )}
                        </div>

                        {selectedCommunity.stats && <CommunityStats stats={selectedCommunity.stats} />}
                        {selectedCommunity.rules && <CommunityRules rules={selectedCommunity.rules} />}
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Discover Communities</h1>
                                <p className="text-muted-foreground">Join communities to share and borrow items with like-minded people</p>
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" className="whitespace-nowrap w-full sm:w-auto">
                                            <MapPin className="mr-2 h-4 w-4" />
                                            <span className="sm:inline">Suggest Community</span>
                                            <span className="sm:hidden">Suggest</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="w-[95vw] max-w-[550px] p-4 sm:p-6 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 fixed max-h-[90vh] overflow-y-auto">
                                        <DialogHeader className="mb-3">
                                            <DialogTitle>Suggest a New Community</DialogTitle>
                                            <DialogDescription>
                                                Submit details about a community you'd like to see on the platform.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmitSuggestion} className="space-y-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-sm font-medium">
                                                    Community Name*
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={suggestionForm.name}
                                                    onChange={handleFormChange}
                                                    placeholder="e.g. Prestige Shantiniketan"
                                                    className={formErrors.name ? "border-red-500" : ""}
                                                />
                                                {formErrors.name && (
                                                    <p className="text-sm text-red-500 flex items-center mt-1">
                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                        {formErrors.name}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="city" className="text-sm font-medium">
                                                        City*
                                                    </Label>
                                                    <Input
                                                        id="city"
                                                        name="city"
                                                        value={suggestionForm.city}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. Bangalore"
                                                        className={formErrors.city ? "border-red-500" : ""}
                                                    />
                                                    {formErrors.city && (
                                                        <p className="text-sm text-red-500 flex items-center mt-1">
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            {formErrors.city}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <Label htmlFor="pincode" className="text-sm font-medium">
                                                        Pincode*
                                                    </Label>
                                                    <Input
                                                        id="pincode"
                                                        name="pincode"
                                                        value={suggestionForm.pincode}
                                                        onChange={handleFormChange}
                                                        placeholder="e.g. 560037"
                                                        className={formErrors.pincode ? "border-red-500" : ""}
                                                    />
                                                    {formErrors.pincode && (
                                                        <p className="text-sm text-red-500 flex items-center mt-1">
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            {formErrors.pincode}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Map preview */}
                                            {showMap && (
                                                <div className="pt-2 pb-1">
                                                    <Label className="text-sm font-medium mb-2 block">
                                                        Location Preview
                                                    </Label>
                                                    <div className="border rounded-lg overflow-hidden shadow-sm">
                                                        <div className="p-3 bg-card">
                                                            <h3 className="text-sm font-medium flex items-center gap-2">
                                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                                {suggestionForm.city}{suggestionForm.pincode ? `, ${suggestionForm.pincode}` : ''}
                                                            </h3>
                                                        </div>
                                                        <div className="h-[180px] w-full">
                                                            <MapContainer 
                                                                center={mapCenter} 
                                                                zoom={14}
                                                                style={{ height: '100%', width: '100%' }}
                                                                key={`map-${mapCenter[0]}-${mapCenter[1]}`}
                                                                zoomControl={false}
                                                            >
                                                                <TileLayer
                                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                />
                                                                <Marker position={mapCenter}>
                                                                    <Popup>
                                                                        {suggestionForm.name || 'New Community'}
                                                                    </Popup>
                                                                </Marker>
                                                                <MapEvents setSuggestionForm={setSuggestionForm} />
                                                            </MapContainer>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Map shows the selected coordinates. Click on the map to set latitude and longitude.
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="description" className="text-sm font-medium">
                                                    Description <span className="text-muted-foreground">(optional)</span>
                                                </Label>
                                                <Input
                                                    id="description"
                                                    name="description"
                                                    value={suggestionForm.description}
                                                    onChange={handleFormChange}
                                                    placeholder="Brief description of the community"
                                                />
                                            </div>
                                            
                                            <DialogFooter className="pt-4 flex-col sm:flex-row gap-3 justify-center sm:justify-end">
                                                <Button 
                                                    type="submit" 
                                                    disabled={isSubmitting}
                                                    className="w-full sm:w-auto h-10 text-base"
                                                >
                                                    {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="w-full sm:w-auto h-10 text-base"
                                                >
                                                    Cancel
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                
                                <Button variant="outline" className="hidden sm:flex">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Community
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {communities.map((community) => (
                                <motion.div
                                    key={community.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: communities.indexOf(community) * 0.1 }}
                                >
                                    <CommunityCard 
                                        community={community}
                                        isJoined={joinedCommunityIds.has(community.id)}
                                        onClick={() => handleSelectCommunity(community.id)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

const MapEvents = ({ setSuggestionForm }: { setSuggestionForm: React.Dispatch<React.SetStateAction<SuggestionFormState>> }) => {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setSuggestionForm((prev: SuggestionFormState) => ({
                ...prev,
                latitude: lat.toFixed(7),
                longitude: lng.toFixed(7),
            }));
        },
    });
    return null;
};

export default CommunityBrowser;