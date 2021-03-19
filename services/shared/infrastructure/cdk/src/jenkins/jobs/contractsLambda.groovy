pipelineJob("contracts-lambda") {
    properties {
        pipelineTriggers {
            triggers {
                pollSCM {
                    scmpoll_spec('H/15 * * * *')
                }
            }
        }
    }
    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        github("octoConsulting/GSA_FSS19_DevOps", "https")
                        credentials('github-token')
                        branch("*/master")
                    }
                }
            }
            scriptPath("services/cis/modules/java/contract-information-service/Jenkinsfile")
        }
    }
}