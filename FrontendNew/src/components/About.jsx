import Button from './Button';

export default function About() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Welcome to Kim's Icon Multi-Speciality Hospital</h2>
          <p className="mb-6">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Aliquid voluptatibus laboriosam tempore officiis quos praesentium.
          </p>
          <ul className="space-y-4 mb-6">
            <li className="flex items-center">
              <span className="text-teal-500 mr-2">•</span> 15+ Years of Experience
            </li>
            <li className="flex items-center">
              <span className="text-teal-500 mr-2">•</span> 24/7 Hour Service
            </li>
            <li className="flex items-center">
              <span className="text-teal-500 mr-2">•</span> A Multispeciality Hospital
            </li>
            <li className="flex items-center">
              <span className="text-teal-500 mr-2">•</span> A Team of Professionals
            </li>
          </ul>
          <Button>Book An Appointment</Button>
        </div>
        <div className="md:w-1/2 p-6">
          {/* Placeholder for doctor image */}
          <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center">
            Doctor Image
          </div>
        </div>
      </div>
    </section>
  );
}