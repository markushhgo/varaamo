import { Factory } from 'rosie';

const Image = new Factory()
  .sequence('url', index => `http://10.201.204.47:8000/resource_image/${index}`)
  .attr('type', 'main')
  .sequence('caption', index => `Caption for Image #${index}`);

export default Image;
