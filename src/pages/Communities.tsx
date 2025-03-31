"use client";

import React, { useState } from 'react';
import { Users, ArrowLeft, Check, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import NavBar from "@/components/NavBar";
import { Community } from "@/types/community";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { CommunityDetails } from "@/components/communities/CommunityDetails";
import { CommunityHeader } from "@/components/communities/CommunityHeader";
import { CommunityLocation } from "@/components/communities/CommunityLocation";
import { CommunityStats } from "@/components/communities/CommunityStats";
import { CommunityRules } from "@/components/communities/CommunityRules";

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
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Discover Communities</h1>
                                <p className="text-muted-foreground">Join communities to share and borrow items with like-minded people</p>
                            </div>
                            <Button variant="outline" className="hidden sm:flex">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Community
                            </Button>
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

export default CommunityBrowser;