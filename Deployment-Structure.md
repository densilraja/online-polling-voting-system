                         GITHUB
                            |
                            | PUSH
                            v
                       +---------+
                       | JENKINS |
                       +----+----+
                            |
              +-------------+-------------+
              |             |             |
             Test       SonarQube       Trivy
              |             |             |
              +-------------+-------------+
                            |
                            v
                      Docker Build
                            |
                            v
                          ECR
                            |
                            v
                    +---------------+
                    |      VPC      |
                    |  10.0.0.0/16  |
                    +-------+-------+
                            |
                +-----------+-----------+
                |                       |
          PUBLIC SUBNETS          PRIVATE SUBNETS
                |                       |
                v                       |
             ALB                        |
                |                       |
          +-----+-----+                 |
          |           |                 |
        App 1       App 2               |
          |           |                 |
          +-----+-----+                 |
                |                       |
                +----------+------------+
                           |
                           v
                       RDS MySQL
                    Private Subnet
