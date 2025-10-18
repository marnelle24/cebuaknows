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
  LucideIcon,
  University,
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
  University,
}

export function getIcon(iconName: string): LucideIcon | null {
  return iconMap[iconName] || null
}

