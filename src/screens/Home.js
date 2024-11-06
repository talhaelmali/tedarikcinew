import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Popover, PopoverButton, PopoverGroup, PopoverPanel } from '@headlessui/react'
import {
  InboxIcon,
  TrashIcon,
  UsersIcon,
  CreditCardIcon,
  HeartIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import FeaturedBlogs from '../components/FeaturedBlogs';
import Header from '../components/Header';
import useLogo from '../hooks/useLogo'; // useLogo hook'unu import edin
import Footer from './Footer';
import FeaturedAnnouncements from '../components/FeaturedAnnouncements';



const features = [
  {
    name: 'Güvenli Ödeme',
    description:"Güvenli ödeme yöntemleri ile işlemlerinizi kolayca gerçekleştirin.",
    href: '#',
    icon: CreditCardIcon,
  },
  {
    name: 'Kullanıcı Dostu Arayüz',
    description:
'Kolay ve hızlı bir şekilde ilan verin ve teklif alın.',
    href: '#',
    icon: HeartIcon,
  },
  {
    name: 'Sohbet ve İletişim',
    description:
      'Alıcı ve satıcılar arasında hızlı ve kolay iletişim.',
    href: '#',
    icon: BoltIcon,
  },
]


const posts = [
  {
    id: 1,
    title: 'Sürdürülebilir İş Modelleri ile Geleceği Şekillendirmek',
    href: 'blog1',
    description:
      'Sürdürülebilirlik iş dünyasında nasıl bir fark yaratır? Sürdürülebilir iş modellerinin faydalarını ve çevresel etkilerini ele alarak, şirketlerin nasıl daha yeşil ve sorumlu hale gelebileceğini inceleyin.',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
    date: 'Sürdürülebilirlik',
    author: {
      name: 'Michael Foster',
      role: 'Co-Founder / CTO',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  // More posts...
]




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const logoUrl = useLogo();










  
  return (
    <div className="bg-white">

<Header/>
      <main>
        <div className="relative bg-[#F3F8FF]">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pb-24 pt-10 sm:pb-32 lg:col-span-7 lg:px-0 lg:pb-56 lg:pt-48 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="mt-24 text-4xl font-bold tracking-tight text-[#0D408F] sm:mt-10 sm:text-6xl">
  <span className="inline text-[#1CB9C8]">Hızlı</span> ve 
  <span className="inline text-[#1CB9C8]"> Güvenli </span> 
  Ticaretin Adresi
</h1>


            <p className="mt-6 text-lg leading-8 text-gray-600">
            e-Tedarikçi ile alım-satım işlemlerinizde güvenliği ve şeffaflığı ön planda tutun. Hemen katılın ve güvenli ticaretin keyfini çıkarın.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#"
                className=" bg-[#0D408F] rounded px-5 py-3.5 text-sm text-white shadow-sm hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Hemen Katıl
              </a>
         
            </div>
          </div>
        </div>
        <div className="relative lg:col-span-3 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <img
            className="aspect-[3/2] w-full object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/banneretedarikci.svg?alt=media&token=d3543047-011b-445a-a70c-ad06f38ecc46"
            alt=""
          />
        </div>
      </div>
    </div>

    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-blue-900">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1CB9C8]">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-500">
                  <p className="flex-auto">{feature.description}</p>
             
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>





        {/* Stats section */}
       <div className="relative bg-white">
      <img
        className="h-full w-auto object-fit lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-1/2"
        src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/banner2.svg?alt=media&token=ddafb6fc-98ce-40bf-a3b8-7d7ebdef884f"
        alt=""
      />
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="px-6 pb-24 pt-16 sm:pb-32 sm:pt-20 lg:col-start-2 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl lg:mr-0 lg:max-w-lg">
            <p className="mt-2 text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
            Zamandan Tasarruf Edin ve Doğru Tedarikçiyi Hızla Bulun!
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste
              dolor cupiditate blanditiis ratione.
            </p>

          </div>
        </div>
      </div>
    </div>

    <div className="bg-gray-50 pt-12 sm:pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
          80’den fazla firma bize güvendi.
          </h2>
          <p className="mt-3 text-xl font-light text-gray-500 sm:mt-4">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus repellat laudantium.
          </p>
        </div>
      </div>
      <div className="mt-10 bg-white pb-12 sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-50" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Memnuniyet</dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-[#1CB9C8]">100%</dd>
                </div>
                <div className="flex flex-col border-b border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Hizmet</dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-[#1CB9C8]">24/7</dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">Farklı Sektör</dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-[#1CB9C8]">100k</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>


        {/* Testimonial Section */}
        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        {logoUrl ? (
              <img
                className="mx-auto h-12"
                src={logoUrl}
                alt="Company Logo"
              />
            ) : (
              <span className="text-xl font-bold text-gray-900">ETedarikçi</span>
            )}
        <figure className="mt-10">
          <blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
            <p>
            Güvenli ödeme yöntemleri ve hızlı teklif süreci sayesinde işlemlerimizi çok daha rahat ve güvenilir bir şekilde gerçekleştirebiliyoruz. Bu özellikler, müşteri memnuniyetini artırmak ve iş akışını hızlandırmak adına gerçekten harika.
            </p>
          </blockquote>
          <figcaption className="mt-10">
            <img
              className="mx-auto h-10 w-10 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900">Ayşe Demir</div>
              <svg viewBox="0 0 2 2" width={3} height={3} aria-hidden="true" className="fill-gray-900">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <div className="text-gray-600">CEO of Workcation</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>

    <FeaturedBlogs/>
    <FeaturedAnnouncements/>




    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h2 className="text-lg font-semibold leading-8 text-gray-900">
            Başlıca Referans Firmalar
          </h2>
          <div className="mx-auto mt-10 grid grid-cols-4 items-start gap-x-8 gap-y-10 sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:grid-cols-5">
            <img
              className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
              src="https://tailwindui.com/img/logos/transistor-logo-gray-900.svg"
              alt="Transistor"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
              src="https://tailwindui.com/img/logos/reform-logo-gray-900.svg"
              alt="Reform"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
              src="https://tailwindui.com/img/logos/tuple-logo-gray-900.svg"
              alt="Tuple"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
              src="https://tailwindui.com/img/logos/savvycal-logo-gray-900.svg"
              alt="SavvyCal"
              width={158}
              height={48}
            />
            <img
              className="col-span-2 max-h-12 w-full object-contain object-left lg:col-span-1"
              src="https://tailwindui.com/img/logos/statamic-logo-gray-900.svg"
              alt="Statamic"
              width={158}
              height={48}
            />
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-[#0D408F] px-6 pt-16 shadow-2xl sm:rounded-xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
         
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            İşleri Kolaylaştırmaya Hazır mısın?
            </h2>
            <p className="mt-6 text-sm leading-8 text-gray-300">
            E-Tedarikçi ile iş süreçlerinizi hızlandırın! Güvenli ödeme yöntemleri ve hızlı teklif süreçleri sayesinde zamandan tasarruf edin ve en iyi tedarikçileri kolayca bulun. İşlerinizi daha verimli ve güvenilir bir şekilde yönetmenin keyfini çıkarın.            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="/register"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm  text-[#0D408F] shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Şimdi Kayıt Ol
              </a>
        
            </div>
          </div>
          <div className="relative mt-16 h-80 lg:mt-8">
            <img
              className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
              src="https://firebasestorage.googleapis.com/v0/b/ihale-6cb24.appspot.com/o/App%20screenshot.png?alt=media&token=5cf7c011-b8c7-41cc-ae12-33e02130b6e2"
              alt="App screenshot"
              width={1824}
              height={1080}
            />
          </div>
        </div>
      </div>
    </div>
      </main>
      <Footer/>

    </div>
    
  )
}
