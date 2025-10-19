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
  Briefcase,
  House,
  Store,
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
  Briefcase,
  House,
  Store,
}

export function getIcon(iconName: string): LucideIcon | null {
  return iconMap[iconName] || null
}

