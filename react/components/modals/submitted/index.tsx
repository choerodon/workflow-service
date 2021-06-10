import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'choerodon-ui/pro';
import {
  IFlowData, IModalProps, ProcessHistory,
} from '@/common/types';
import { approveApi, InstanceDetail } from '@/api';
import History from '@/components/history';
import FlowChart from '@/components/flow-chart';
import ProcessDetail from '@/components/process-detail';
import { ButtonColor, FuncType } from 'choerodon-ui/pro/lib/button/enum';
import BaseModal, { BaseModalProps } from '../components/base-modal';

const prefix = 'c7n-backlogApprove-modal';
export interface SubmittedModalProps {
  modal?: IModalProps,
  taskId: string
  instanceId: string
  onClose: () => void
  SummaryComponent?: React.ReactNode
  extraTabs?: BaseModalProps['tabs']
}

const SubmittedModal: React.FC<SubmittedModalProps> = (props) => {
  const {
    modal, SummaryComponent, extraTabs, taskId, instanceId, onClose,
  } = props;
  const [state, setState] = useState<{
    loading: boolean
    data: {
      submittedDetail: Partial<InstanceDetail>
    },
    historyList: ProcessHistory[]
    flowData: IFlowData | null
  }>({
    loading: false,
    historyList: [],
    data: {
      submittedDetail: {},
    },
    flowData: null,
  });
  const refresh = useCallback(async () => {
    const data = await approveApi.getSubmitted(instanceId);
    let historyList = [];
    if (instanceId) {
      historyList = await approveApi.loadHistoryByInstanceId(instanceId);
    }
    const flowData = await approveApi.getFlowData(instanceId);
    setState({
      loading: false,
      historyList,
      data,
      flowData,
    });
  }, [instanceId]);
  const handleClickUrge = useCallback(async () => {
    await approveApi.urge(instanceId);
  }, [instanceId]);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const handleClose = useCallback(() => {
    modal?.close();
    onClose();
  }, [modal, onClose]);
  return (
    <BaseModal
      loading={state.loading}
      tabTop={SummaryComponent}
      tabs={[...(extraTabs ?? []),
        {
          title: '流程信息',
          key: 'suggest',
          component: () => (state.data.submittedDetail ? <ProcessDetail data={state.data.submittedDetail} /> : null),
        },
        {
          title: '审核历史',
          key: 'history',
          component: () => (
            <div style={{ paddingTop: 11.5 }}>
              <History
                historyList={state.historyList}
              />
            </div>
          ),
        },
        {
          title: '缩略图',
          key: 'flowChart',
          component: () => state.flowData && <FlowChart flowData={state.flowData} />,
        }]}
      footer={() => (
        <div style={{ textAlign: 'right' }}>
          <Button
            onClick={handleClose}
            funcType={'raised' as FuncType}
          >
            关闭
          </Button>
          {state.data.submittedDetail.urgeEnableFlag ? (
            <Button
              onClick={handleClickUrge}
              color={'primary' as ButtonColor}
              funcType={'raised' as FuncType}
            >
              催办
            </Button>
          ) : null}
        </div>
      )}
    />
  );
};

const openSubmittedModal = (props: SubmittedModalProps) => Modal.open({
  key: 'SubmittedModal',
  title: '流程明细',
  drawer: true,
  children: <SubmittedModal {...props} />,
  className: prefix,
  style: {
    width: 740,
  },
  footer: null,
});
export default openSubmittedModal;
