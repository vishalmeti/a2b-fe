import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { Community } from "@/types/community";

interface Props {
    community: Community;
}

export const CommunityLocation = ({ community }: Props) => (
    <Card className='flex-1'>
        <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground">{community.location}</p>
            {community.coordinates && (
                <div className="h-[200px] w-full rounded-lg overflow-hidden border">
                    <MapContainer 
                        center={[community.coordinates.lat, community.coordinates.lng] as LatLngExpression}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[community.coordinates.lat, community.coordinates.lng]}>
                            <Popup>
                                {community.name}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            )}
        </CardContent>
    </Card>
);
