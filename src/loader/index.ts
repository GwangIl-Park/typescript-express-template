import jobs from '@/jobs';
import server from './server';
import mongoose from './mongoose';
import dependencyInjector from './dependencyInjector';

export default async({expressApp}) => {
  await mongoose();

  dependencyInjector();
  
  jobs();

  await server({app:expressApp});
}