import React from "react";
import PageTitle from "../components/PageTitle";
import { FeaturesData, TechData, MoreInformation } from "../utils/landingPageData";
import WhatsAppFab from "../utils/landingPageData/WhatsAppFab";
import Icon from "../components/Icon";
import { useForm } from 'react-hook-form';
import landingPageText from "../texts/landingPageText.json";
import Input from "../components/input";
import Typography from '@mui/material/Typography';
import ActionAreaCard from "../components/cards/ActionAreaCard";
import LandingPageNavbar from "../components/landingPageNavbar";
import IconCard from "../components/cards/IconCard";
import Footer from "../components/Footer";
import Alerts from '../components/Alerts';
import useError from '../hooks/useError';
import useSuccess from '../hooks/useSuccess';
import useLoading from '../hooks/useLoading';
import { postContactRequest } from '../services/landingPageServices';

export function LandingPage() {
  const { error, setError } = useError();
  const { success, setSuccess } = useSuccess();
  const [loading, loadingIcon, setLoading] = useLoading();

  const { 
    register, 
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await postContactRequest(data);
      setSuccess('Mensaje enviado correctamente');
      reset();
    } catch (error) {
      console.log(error)
      setError('Error al enviar el mensaje');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LandingPageNavbar from={landingPageText.navbar.principalPage} />
      <div className="flex h-screen content-center items-center justify-center pt-16 pb-32 bg-custom">
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <Typography
                variant="h2"
                color="white"
                className="mb-6 font-black text-white"
              >
                {landingPageText.titles.welcome}
              </Typography>
              <Typography variant="h6"  style={{ fontWeight: '700', color: 'white'}} className="opacity-90">
                {landingPageText.descriptions.attentionGrabber}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-white px-4 pb-20 pt-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 justify-items-center grid-cols-1 gap-12 z-40 -mt-24">
            {FeaturesData.map(({ color, title, icon, description }) => (
              <IconCard
                color={color}
                title={title}
                icon={icon}
                description={description}
              />
            ))}
          </div>
          <div className="mt-32 flex flex-wrap items-center">
            <div className="mx-auto -mt-8 w-full px-4 md:w-5/12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 p-2 text-center shadow-lg shadow-gray-300">
                <Icon icon="HomeWork" classNameIcon="text-gray-800 h-8 w-8" />
              </div>
              <Typography
                variant="h5"
                className="font-bold mb-3"
              >
                {landingPageText.titles.presentation}
              </Typography>
              <Typography variant="h9" className="mb-8 font-normal text-blue-gray-500">
                {landingPageText.descriptions.presentation}
                <br />
              </Typography>
            </div>
            <div className="mx-auto mt-24 flex w-full justify-center px-4 md:w-4/12 lg:mt-0">
              <ActionAreaCard
                title={landingPageText.titles.aboutUs}
                description={landingPageText.descriptions.aboutUs}
                path="img8.webp"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="bg-cover bg-gray-800">
        <section className="px-4 pt-8 pb-12 text-white">
          <div className="container mx-auto">
            <PageTitle section={landingPageText.titles.ourTechnologies} heading={landingPageText.titles.usedResources}>
              {landingPageText.descriptions.ourTechnologies}
            </PageTitle>
            <div className="mt-24 grid grid-cols-1 gap-12 gap-x-24 md:grid-cols-2 xl:grid-cols-4 justify-items-center">
              {TechData.map(({ img, name, description }) => (
                <ActionAreaCard
                  title={name}
                  description={description}
                  path={img} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <section className="relative pt-12 bg-white px-4">
        <div className="container mx-auto">
          <PageTitle section={landingPageText.titles.ourBenefits} heading={landingPageText.titles.benefitsList}>
            {landingPageText.descriptions.ourBenefits}
          </PageTitle>
          <div className="mx-auto mt-20 mb-24 flex flex-wrap justify-center gap-16">
            {MoreInformation.map(({ title, icon, description }) => (
              <IconCard 
                title={title}
                icon={icon}
                description={description}
              />
            ))}
          </div>

        </div>
      </section>
      <div className="bg-cover bg-gray-800 text-white">
        <section className="py-6">
          <PageTitle section={landingPageText.titles.contactUs} heading={landingPageText.titles.wantOurServices}>
            {landingPageText.descriptions.contactUs}
          </PageTitle>
          <form className="mx-auto mt-12 w-6/12 text-white" onSubmit={handleSubmit(onSubmit)}>
            {loading ? (
                <div>{loadingIcon}</div>
              ) : success ? (
                <Alerts type='success' message={success} />
              ) : (
              <div>
                {error && <Alerts type='error' message={error} />}
                <div className="mb-8">
                  <Input
                    name="Correo Electrónico" 
                    label="email" 
                    placeholder="nombre@gmail.com"
                    register={register}
                    classNameLabel='block text-sm font-medium leading-6 text-white'
                    classNameInput='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-white focus:ring-0 sm:text-sm sm:leading-6'
                    validation={{ 
                      required: {
                        value: true, 
                        message: 'Este campo es obligatorio'
                      }, 
                      pattern: {
                        value: /^\S+@\S+\.\S+$/, 
                        message: 'El correo no es válido'
                      } 
                    }} 
                    errors={errors}  
                  />
                  <Input 
                    name="Nombre Completo"
                    label="name"
                    classNameLabel='block mt-5 text-sm font-medium leading-6 text-white'
                    classNameInput='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-white focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder="Juan Pablo Cisternas"
                    register={register}
                    validation={{ required: true }}
                    errors={errors}
                  />
                  <Input
                    name="Mensaje"
                    label="message"
                    placeholder="Escriba tu mensaje aquí"
                    register={register}
                    classNameLabel='block mt-5 text-sm font-medium leading-6 text-white'
                    classNameInput='w-full block border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-white focus:ring-0 sm:text-sm'
                    validation={{ required: true }}
                    errors={errors}
                  />

                  <button type="submit" className="w-full bg-white text-black py-2 rounded-md hover:bg-cyan-100 my-4">
                    {landingPageText.buttons.send}
                  </button>
                </div>
              </div>
              )
            }
          </form>
        </section>
      </div>
      <div className="bg-white">
        <Footer />
      </div>
      <WhatsAppFab />
    </div>
  );
}

export default LandingPage;
