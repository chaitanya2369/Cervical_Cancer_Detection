import Button from './Button';

export default function Hero() {
  return (
    <section className="py-16 px-11 flex items-center bg-gradient-to-b from-teal-400 to-teal-600">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-11">
          <p className="text-2xl">Welcome to CerviScan</p>
          <h1 className="text-3xl italic font-bold mb-4">
            "Empowering Early Detection for a Healthier Tomorrow™"
          </h1>
          <p className="mb-6">
          Utilizing state-of-the-art imaging and AI technology, our application delivers rapid and accurate cervical cancer detection, empowering healthcare professionals to save lives through early diagnosis.
          </p>
          <Button>Get Started</Button>
        </div>
        <div className="md:w-1/2 p-6">
          {/* Placeholder for doctor image */}
          <div className="bg-gray-300 h-64 rounded-lg flex items-center justify-center">
            <img src="/images/body-image.png" alt="hello there!" />
          </div>
        </div>
      </div>
    </section>
  );
}