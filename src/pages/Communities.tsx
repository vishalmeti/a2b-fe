// src/components/CommunityBrowser.tsx (or your preferred location)
"use client"; // Add if using Next.js App Router

import React, { useState } from 'react';
import { Users, ArrowLeft, Check, Plus, MapPin, Star, Share2, Clock, Shield } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';

interface Community {
    id: string;
    name: string;
    description: string;
    longDescription: string;
    memberCount: number;
    imageUrl?: string;
    tags?: string[];
    stats: {
        activeBorrows: number;
        totalItemsShared: number;
        successfulTransactions: number;
        averageRating: number;
    };
    rules?: string[];
    location?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

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
        location: 'Downtown Metro Area',
        coordinates:{
            lat: 77.594566,
            lng: 12.971599
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

const CommunityBrowser = () => {
    const [communities] = useState<Community[]>(placeholderCommunities); // Replace with data fetching
    const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
    const [joinedCommunityIds, setJoinedCommunityIds] = useState<Set<string>>(new Set(['2']));

    const selectedCommunity = communities.find(c => c.id === selectedCommunityId);
    const isMember = selectedCommunity ? joinedCommunityIds.has(selectedCommunity.id) : false;

    const handleSelectCommunity = (id: string) => {
        setSelectedCommunityId(id);
        window.scrollTo(0, 0);
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

    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            {selectedCommunity ? (
                <motion.div
                    key={selectedCommunity.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6"
                >
                    <Button variant="ghost" onClick={handleGoBack} className="mb-4 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Communities
                    </Button>

                    <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-card border rounded-lg">
                        <Avatar className="w-20 h-20 border-2 border-primary/20">
                            <AvatarImage src={selectedCommunity.imageUrl} alt={selectedCommunity.name} />
                            <AvatarFallback className="text-2xl bg-muted">{selectedCommunity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <CardTitle className="text-3xl font-bold tracking-tight mb-2">{selectedCommunity.name}</CardTitle>
                            <div className="flex items-center text-muted-foreground text-sm mb-3">
                                <Users className="mr-2 h-4 w-4" />
                                {selectedCommunity.memberCount.toLocaleString()} members
                            </div>
                            {selectedCommunity.tags && selectedCommunity.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {selectedCommunity.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            )}
                            <Button
                                variant={isMember ? 'outline' : 'default'}
                                size="lg"
                                onClick={() => handleJoinToggle(selectedCommunity.id)}
                                className="w-full sm:w-auto transition-all duration-200 ease-in-out"
                            >
                                {isMember ? (
                                    <> <Check className="mr-2 h-4 w-4" /> Joined</>
                                ) : (
                                    <> <Plus className="mr-2 h-4 w-4" /> Join Community</>
                                )}
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">About this community</CardTitle>
                        </CardHeader>
                        <CardContent className="text-base text-muted-foreground leading-relaxed">
                            {selectedCommunity.longDescription}
                        </CardContent>
                    </Card>

                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="text-xl">Community Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                                    <Share2 className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold text-primary">{selectedCommunity.stats.activeBorrows}</span>
                                    <span className="text-sm text-muted-foreground text-center">Active Borrows</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                                    <Users className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold text-primary">{selectedCommunity.stats.totalItemsShared}</span>
                                    <span className="text-sm text-muted-foreground text-center">Items Shared</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                                    <Clock className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold text-primary">{selectedCommunity.stats.successfulTransactions}</span>
                                    <span className="text-sm text-muted-foreground text-center">Completed Borrows</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-secondary/20 rounded-lg">
                                    <Star className="h-6 w-6 text-primary mb-2" />
                                    <span className="text-2xl font-bold text-primary">{selectedCommunity.stats.averageRating}★</span>
                                    <span className="text-sm text-muted-foreground text-center">Avg. Rating</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {selectedCommunity.location && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{selectedCommunity.location}</p>
                                {selectedCommunity.coordinates && (
                                    <div className="h-[300px] w-full rounded-lg overflow-hidden border">
                                        <MapContainer 
                                            center={[selectedCommunity.coordinates.lat, selectedCommunity.coordinates.lng] as LatLngExpression}
                                            zoom={14}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[selectedCommunity.coordinates.lat, selectedCommunity.coordinates.lng]}>
                                                <Popup>
                                                    {selectedCommunity.name}
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {selectedCommunity.rules && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Community Rules
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {selectedCommunity.rules.map((rule, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">
                                                {index + 1}
                                            </span>
                                            <span className="text-muted-foreground flex-1">{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            ) : (
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Discover Communities</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {communities.map((community) => (
                            <motion.div
                                key={community.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: communities.indexOf(community) * 0.05 }}
                            >
                                <Card
                                    className="h-full flex flex-col cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-200 ease-in-out"
                                    onClick={() => handleSelectCommunity(community.id)}
                                >
                                    <CardHeader className="flex flex-row items-center gap-4 pb-3">
                                        <Avatar className="w-10 h-10 border">
                                            <AvatarImage src={community.imageUrl} alt={community.name} />
                                            <AvatarFallback className="bg-secondary">{community.name.substring(0, 1)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg font-semibold leading-tight">{community.name}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow pb-3">
                                        <CardDescription className="line-clamp-2 text-sm">{community.description}</CardDescription>
                                    </CardContent>
                                    <div className="px-6 pb-3 flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{community.stats.activeBorrows}</span> active
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">{community.stats.averageRating}★</span> rating
                                        </div>
                                    </div>
                                    <CardFooter className="text-xs text-muted-foreground flex items-center justify-between pt-3 border-t">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {community.memberCount.toLocaleString()} Members
                                        </span>
                                        {joinedCommunityIds.has(community.id) && (
                                            <Badge variant="outline" className="text-primary border-primary/50">Joined</Badge>
                                        )}
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityBrowser;