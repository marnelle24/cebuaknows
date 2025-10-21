import AdminLayout from '@/components/admin/AdminLayout'
import PlaceManagement from '@/components/admin/PlaceManagement'

export default function PlacesPage() {
  return (
    <AdminLayout>
      <div className="mt-8">
        <PlaceManagement />
      </div>
    </AdminLayout>
  )
}
