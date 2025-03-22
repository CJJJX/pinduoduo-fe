import { DatePicker } from 'antd';
import { Dayjs } from 'dayjs';
import type { Moment } from 'moment';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';
import dayjsGenerateConfig  from 'rc-picker/lib/generate/dayjs';

const MyDatePicker = DatePicker.generatePicker<Dayjs>(dayjsGenerateConfig);

export default MyDatePicker;