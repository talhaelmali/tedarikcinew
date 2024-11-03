import { CursorArrowRaysIcon, ShoppingCartIcon, DocumentCheckIcon, MegaphoneIcon} from '@heroicons/react/24/outline'

const stats = [
  { id: 1, name: 'Teklifleriniz', stat: '10', icon: MegaphoneIcon,  },
  { id: 2, name: 'Onaylanan Teklifler', stat: '4', icon: DocumentCheckIcon,  },
  { id: 3, name: 'Satılan Siparişler', stat: '12', icon: ShoppingCartIcon, },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SalerStats() {
  return (
    <div>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 shadow sm:px-6 "
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm  text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-5">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>

      
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
