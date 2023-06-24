/*
 * @Author: C-Dragon
 * @Date: 2023-06-24 18:27:59
 * @LastEditTime: 2023-06-24 18:34:50
 * @Description: 
 * @FilePath: /umi-test/src/pages/Home/index.tsx
 */
import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
