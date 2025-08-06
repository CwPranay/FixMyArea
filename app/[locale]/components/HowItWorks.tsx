'use client';

export default function HowItWorksSection() {
  const steps = [
    {
      title: 'Find Your Area',
      description: 'Select your location to view or report nearby issues.',
      icon: '📍',
    },
    {
      title: 'Report the Issue',
      description: 'Fill a short form to describe the issue and submit.',
      icon: '📝',
    },
    {
      title: 'Get It Resolved',
      description: 'Your issue is visible to local authorities and others.',
      icon: '⚙️',
    },
  ];

  return (
    <section
      className="py-12 px-4 sm:px-6 md:px-8 bg-gray-50 [font-family:var(--font-poppins)]"
      id="how-it-works"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          How It Works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-6 sm:p-8 bg-white rounded-2xl shadow-md transition hover:shadow-lg"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
