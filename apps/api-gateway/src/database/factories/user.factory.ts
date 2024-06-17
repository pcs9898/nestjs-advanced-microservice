import { User } from 'src/apis/user/entity/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = faker.internet.password();

  return user;
});
