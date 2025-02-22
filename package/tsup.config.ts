import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', "src/worker.ts"],  
  format: ['esm'],   
  target: 'node16',         
  outDir: 'dist',           
  sourcemap: true,          
  clean: true,              
  minify: false,            
  bundle: true,             
  platform: 'node',
  splitting: false,         
});