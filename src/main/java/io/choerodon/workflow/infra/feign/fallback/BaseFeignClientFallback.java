package io.choerodon.workflow.infra.feign.fallback;

import io.choerodon.workflow.infra.feign.BaseFeignClient;
import io.choerodon.core.exception.CommonException;
import org.hzero.workflow.def.infra.feign.dto.UserDTO;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * @author huaxin.deng@hand-china.com 2021-03-12 14:38:41
 */
@Component
public class BaseFeignClientFallback implements BaseFeignClient {

    @Override
    public List<UserDTO> listUsersByIds(Long[] ids, Boolean onlyEnabled) {
        throw new CommonException("error.UserFeign.queryList");
    }
}
