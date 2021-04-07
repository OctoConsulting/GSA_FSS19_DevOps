pipelineJob("nsn-get-routing") {
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
            scriptPath("services/nsn/modules/nodejs/nsn-get-routing/Jenkinsfile")
        }
    }
}