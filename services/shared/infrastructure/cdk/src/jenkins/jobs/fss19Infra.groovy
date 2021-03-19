pipelineJob("fss19-infrastructure") {
    properties {
        pipelineTriggers {
            triggers {
                pollSCM {
                    scmpoll_spec('@daily')
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
            scriptPath("services/Jenkinsfile")
        }
    }
}