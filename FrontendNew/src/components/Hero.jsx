import Button from './Button';

export default function Hero() {
  return (
    <section className=" px-11 flex items-center bg-gradient-to-b from-teal-200 to-teal-400">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 px-11">
          <p className="text-2xl">Welcome to CerviScan</p>
          <h1 className="text-3xl italic font-bold mb-4">
            "Empowering Early Detection for a Healthier Tomorrow™"
          </h1>
          <p className="mb-6">
          Utilizing state-of-the-art imaging and AI technology, our application delivers rapid and accurate cervical cancer detection, empowering healthcare professionals to save lives through early diagnosis.
          </p>
          <button className='px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-300' >Get Started</button>
        </div>
        <div className="md:w-1/2 px-6">
          <div className="rounded-lg flex items-center justify-center">
            <img src="/images/body-image.png" className='w-auto h-fit' alt="Err" />
          </div>
        </div>
      </div>
    </section>
  );
}