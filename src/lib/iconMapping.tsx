import {
  Hotel,
  Coffee,
  Camera,
  Utensils,
  Church,
  Car,
  Waves,
  Building,
  Users,
  LucideIcon
} from 'lucide-react'

export const iconMap: Record<string, LucideIcon> = {
  Hotel,
  Coffee,
  Camera,
  Utensils,
  Church,
  Car,
  Waves,
  Building,
  Users,
}

export function getIcon(iconName: string): LucideIcon | null {
  return iconMap[iconName] || null
}

