// utils/addressParser.ts
export function extractCity(address: string): string {
  if (!address) return "Unknown Location";
  
  // Split by commas and clean up
  const parts = address.split(',').map(part => part.trim()).filter(Boolean);
  
  // Pattern: "Kalyan-Dombivli, Ambernath Taluka, Thane, Maharashtra, 421306, India"
  // City is usually the first part, State is the 4th part (index 3)
  
  if (parts.length >= 4) {
    // Return city and state
    const city = parts[0]; // First part (Kalyan-Dombivli)
    const state = parts[3]; // Fourth part (Maharashtra)
    
    if (city && state) {
      return `${city}, ${state}`;
    }
  }
  
  // Fallback for shorter addresses
  if (parts.length >= 2) {
    return parts[0]; // Just return the city
  }
  
  // Final fallback
  return address.length > 25 ? address.substring(0, 25) + "..." : address;
}

export function extractCityOnly(address: string): string {
  if (!address) return "Unknown Location";
  
  const parts = address.split(',').map(part => part.trim()).filter(Boolean);
  
  // City is always the first part in your format
  if (parts.length > 0) {
    return parts[0]; // Returns "Kalyan-Dombivli"
  }
  
  return "Unknown Location";
}

export function extractStateOnly(address: string): string {
  if (!address) return "";
  
  const parts = address.split(',').map(part => part.trim()).filter(Boolean);
  
  // State is the 4th part (index 3) in your format
  if (parts.length >= 4) {
    return parts[3]; // Returns "Maharashtra"
  }
  
  return "";
}