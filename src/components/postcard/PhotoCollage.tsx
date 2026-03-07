import { motion } from "framer-motion";

interface ContributorPhoto {
  id: string;
  name: string;
  country: string;
  photoUrl: string;
  message: string;
}

interface PhotoCollageProps {
  photos: ContributorPhoto[];
  birthdayName: string;
}

export const PhotoCollage = ({ photos, birthdayName }: PhotoCollageProps) => {
  if (photos.length === 0) return null;

  // Dynamic grid layout based on photo count
  const getGridClass = (count: number) => {
    if (count <= 4) return "grid-cols-2";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-4";
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
        📸 Photo Collage
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {photos.length} photos from contributors around the world for {birthdayName}
      </p>
      <div className={`grid ${getGridClass(photos.length)} gap-1 rounded-xl overflow-hidden`}>
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="relative aspect-square group"
          >
            <img
              src={photo.photoUrl}
              alt={`From ${photo.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-all flex items-end opacity-0 group-hover:opacity-100">
              <div className="p-2 text-background w-full">
                <p className="text-xs font-semibold truncate">{photo.name}</p>
                <p className="text-[10px] opacity-80 truncate">{photo.country}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
