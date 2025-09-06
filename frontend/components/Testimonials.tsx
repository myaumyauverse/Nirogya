import React from 'react'
import Image from 'next/image'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Saloni Saini",
      role: "MBBS Graduate",
      image: "/test1.jpeg",
      quote: "This system accurately predicts disease outbreaks based on water quality. It's a game-changer for preventive healthcare."
    },
    {
      name: "Utkarsh Yasshwi",
      role: "MBBS Student",
      image: "/test2.jpeg",
      quote: "The 3-month predictions are remarkably accurate. This tool will help healthcare workers prepare better for outbreaks."
    },
    {
      name: "Anshika Bajpai",
      role: "MBBS Student",
      image: "/anshika-bajpai.jpg",
      quote: "The ML integration with water quality data is innovative. This platform transforms reactive healthcare into proactive prevention."
    }
  ]

  return (
    <section id="testimonials" className="bg-gray-10 py-20">
      <div className="max-container padding-container">
        <div className="text-left mb-16">
          <h2 className="bold-40 lg:bold-52 text-gray-90 mb-6">
            Testimonials
          </h2>
          <p className="regular-16 text-gray-50 max-w-2xl">
            Validated by medical professionals and healthcare experts who have tested our disease prediction system with real-world data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 relative shadow-lg hover:shadow-xl transition-all border border-primary-100 min-h-[300px]">
              <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mb-6">
                <span className="text-white text-lg font-bold">
                  {index + 1}
                </span>
              </div>
              <div className="mb-6 min-h-[120px] flex items-start">
                <p className="regular-16 text-gray-700 leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4 absolute bottom-8 left-8 right-8">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="bold-16 text-gray-90">{testimonial.name}</h4>
                  <p className="regular-14 text-primary-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
