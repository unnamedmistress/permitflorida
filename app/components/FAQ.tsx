import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'How accurate is PermitFlorida?',
    answer: 'PermitFlorida uses the official Florida Building Code as its foundation, combined with local amendments from all 470 Florida jurisdictions. We provide confidence scores with each answer and recommend contacting your local building department for final confirmation on complex projects.',
  },
  {
    question: 'Do you cover my specific city or county?',
    answer: 'Yes! We cover all 67 Florida counties and over 400 municipalities. This includes major cities like Miami, Orlando, Tampa, and Jacksonville, as well as smaller towns and unincorporated areas. If we\'re missing something, let us know and we\'ll add it.',
  },
  {
    question: 'What if I\'m in a hurricane or flood zone?',
    answer: 'PermitFlorida automatically factors in hurricane wind zones and FEMA flood zones when determining permit requirements. Florida has special requirements for impact windows, shutters, and elevation certificates in these zones — we handle all of that for you.',
  },
  {
    question: 'Can contractors use this for their clients?',
    answer: 'Absolutely! Our Contractor plan ($49/month) is designed specifically for Florida contractors. It includes lead generation from homeowners using our free tier, a verified contractor badge, and priority support.',
  },
  {
    question: 'What if I already started work without a permit?',
    answer: 'If you discover you need a permit after starting work, contact your local building department immediately. Many jurisdictions allow you to apply retroactively, though fees may be higher. Our Pro plan includes guidance on the retroactive permit process.',
  },
  {
    question: 'Is this legal advice?',
    answer: 'No. PermitFlorida provides general information about permit requirements based on published building codes and municipal regulations. We always recommend verifying requirements with your local building department, especially for complex projects.',
  },
]

export default function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about PermitFlorida
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-gray-50 rounded-xl [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer">
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}