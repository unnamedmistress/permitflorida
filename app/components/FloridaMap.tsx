import { MapPin, CheckCircle } from 'lucide-react'

const stats = [
  { label: 'Florida Counties', value: '67' },
  { label: 'Municipalities', value: '400+' },
  { label: 'Jurisdictions Covered', value: '470' },
  { label: 'Florida Residents Served', value: '10,000+' },
]

const majorCities = [
  'Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale',
  'St. Petersburg', 'Hialeah', 'Tallahassee', 'Port St. Lucie', 'Cape Coral'
]

export default function FloridaMap() {
  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Complete Florida Coverage
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              From the Panhandle to the Keys, we cover every county and municipality in Florida. 
              Including hurricane zones, flood zones, and local amendments.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-blue-800/50 rounded-xl p-4">
                  <div className="text-3xl font-bold text-teal-300 mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-teal-300">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Florida Building Code 2023 Compliant</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-300" />
              Major Cities Covered
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {majorCities.map((city) => (
                <div key={city} className="flex items-center gap-2 text-blue-100">
                  <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <span>{city}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-blue-200 text-sm">
              Plus all smaller cities, towns, and unincorporated areas across Florida.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}