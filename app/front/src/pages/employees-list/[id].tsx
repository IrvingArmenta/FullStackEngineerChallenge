import React, { useCallback, useRef, useState } from 'react';
import { withAuth, WithAuthPagePropsType } from 'api/withAuth';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardSection } from 'pages/dashboard';
import Image from 'next/image';
import { Button } from 'components';
import router from 'next/router';
import { apiRoutes, EmployeeType } from 'api';
import { useForceUpdate } from 'components/EmployeeCard';
import styled from 'styled-components';

const delayOperation = (msec: number) =>
  new Promise((resolve) => setTimeout(resolve, msec));

const EmployeeDetailWrap = styled(motion.div)`
  .reviews-list {
    margin-top: 16px;
    margin-bottom: 32px;
    li {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 8px;
      h4 {
        margin: 0;
        margin-left: 8px;
      }
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      .img {
        font-size: 0;
        width: 48px;
        height: 48px;
        flex: 0.2;
      }
      .content {
        flex: 1;
        padding: 0 8px;
      }
      .info {
        display: flex;
        align-items: center;
        flex: 0.5;
        h4 {
          flex: 1;
        }
      }
    }
  }
`;

const EmployeeDetail = (
  props: WithAuthPagePropsType & {
    incoming: {
      data: { employee: EmployeeType };
    };
  }
) => {
  const { session, incoming } = props;
  const [deleting, setDeleting] = useState(false);
  const cardError = useRef(false);
  const [done, setDone] = useState(false);
  const update = useForceUpdate();

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    await delayOperation(2000);
    try {
      const del = await fetch(
        `http://localhost:9090/employees/${incoming.data?.employee?.id}`,
        {
          method: 'DELETE'
        }
      );
      const delJson = await del.json();
      if (delJson) {
        setDone(true);
        setDeleting(false);
        await delayOperation(3000);
        router.replace('/employees-list');
      }
    } catch (e) {
      setDone(true);
      setDeleting(false);
    }
  }, []);

  return (
    <EmployeeDetailWrap
      layoutId={`$employee-${incoming.data?.employee?.id}`}
      layout={true}
    >
      <DashboardSection layout={true} className="dashboard-wrap">
        {incoming.data.employee && (
          <>
            <h1>{incoming.data.employee.name}</h1>
            <div className="profile">
              <div className="pixel-border img">
                <Image
                  src={
                    cardError.current
                      ? 'http://placehold.jp/250x230.png'
                      : incoming.data?.employee?.photoUrl || ''
                  }
                  width={250}
                  height={220}
                  onError={() => {
                    cardError.current = true;
                    update();
                  }}
                />
              </div>
              <span>
                <h3>
                  {'>'} {incoming.data.employee.email}
                </h3>
                <hr />
                <p>
                  {'>'} department: {incoming.data.employee.department}
                </p>
                <p>
                  {'>'} Your rating: {incoming.data.employee.rating}
                </p>
                <Button onClick={() => router.push('/employees-list')}>
                  Go back to the list
                </Button>
                {session.department === 'Admin' && !done && (
                  <div style={{ marginTop: 16 }}>
                    <Button
                      onClick={() => handleDelete()}
                      style={{ background: 'red' }}
                    >
                      Delete this employee
                    </Button>
                  </div>
                )}
                <AnimatePresence>
                  {deleting && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ display: 'block' }}
                    >
                      ...deleting
                    </motion.span>
                  )}
                </AnimatePresence>
                {done && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ color: 'red', fontSize: 10 }}
                  >
                    This employee was removed..., going back to Employees list
                  </motion.p>
                )}
              </span>
            </div>
            <h3 style={{ marginTop: 16 }}>Reviews</h3>
            <ul className="reviews-list">
              {incoming.data.employee.reviews.map((r) => {
                return (
                  <motion.li
                    className="pixel-border"
                    key={`${r.id}`}
                    whileHover={{ scale: 0.96 }}
                  >
                    <div className="info">
                      <div className="img pixel-border">
                        <Image src={r.owner.photoUrl} width={48} height={40} />
                      </div>
                      <h4>{r.owner.name}</h4>
                    </div>
                    <div className="content">{r.content}</div>
                  </motion.li>
                );
              })}
            </ul>
          </>
        )}
      </DashboardSection>
    </EmployeeDetailWrap>
  );
};

export const getServerSideProps = withAuth(async (ctx) => {
  const { id } = ctx.query; // employee id;
  const emp = await fetch(`${apiRoutes.employees}/${id}`);
  const empJson = (await emp.json()) as EmployeeType;

  return {
    props: {
      incoming: empJson
    }
  };
});

export default EmployeeDetail;
