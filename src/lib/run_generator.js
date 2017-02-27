import yeoman from 'yeoman-environment';
import ProjectGenerator from './generators/project_generator';
import MiddlewareGenerator from './generators/middleware_generator';
import BotClassGenerator from './generators/bot_class';

const env = yeoman.createEnv();

env.registerStub(ProjectGenerator, 'project');
env.registerStub(MiddlewareGenerator, 'middleware');
env.registerStub(BotClassGenerator, 'botClass');

const runGenerator = (generatorName, options) => {
  env.run(generatorName, options);
};

export default runGenerator;
