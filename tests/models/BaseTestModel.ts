import { Model } from '../../src/web';

export abstract class BaseTestModel<Data = null> extends Model<Data> {
  clear() {
    try {
      this.changeReducer(() => {
        return this.initReducer();
      });
    } catch {}
  }
}
