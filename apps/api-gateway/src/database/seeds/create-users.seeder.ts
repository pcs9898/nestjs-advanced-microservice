import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/apis/user/entity/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('UserSeeder start');

    const userFactory = await factoryManager.get(User);

    // save 10 factory generated entities, to the database
    await userFactory.saveMany(10);

    console.log('UserSeeder finished');
  }
}
