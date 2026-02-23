import { Check, X, Building2, Users } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    description: 'For occasional DIY projects',
    price: '$0',
    period: '/month',
    icon: null,
    features: [
      { text: '3 permit checks per month', included: true },
      { text: 'Basic YES/NO/MAYBE results', included: true },
      { text: 'Coverage in all 470 FL jurisdictions', included: true },
      { text: 'Detailed requirements & forms', included: false },
      { text: 'Contractor matching', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For homeowners & serious DIYers',
    price: '$19',
    period: '/month',
    icon: Users,
    features: [
      { text: 'Unlimited permit checks', included: true },
      { text: 'Detailed YES/NO/MAYBE results', included: true },
      { text: 'Coverage in all 470 FL jurisdictions', included: true },
      { text: 'Permit forms & requirements library', included: true },
      { text: 'Inspection timeline estimates', included: true },
      { text: 'Priority email support', included: true },
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Contractor',
    description: 'For Florida contractors',
    price: '$49',
    period: '/month',
    icon: Building2,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Lead generation from free users', included: true },
      { text: 'Verified contractor badge', included: true },
      { text: 'Customer project details', included: true },
      { text: 'Priority phone support', included: true },
      { text: 'White-label options', included: false },
    ],
    cta: 'Join as Contractor',
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to all 470 Florida jurisdictions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                {plan.icon && (
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 mt-12 text-sm">
          All paid plans include a 14-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
  )
}