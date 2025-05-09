const _ = require("lodash");
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions;

    return graphql(`
        {
            allMarkdownRemark(limit: 1000) {
                edges {
                    node {
                        id
                        fields {
                            slug
                        }
                        frontmatter {
                            templateKey
                        }
                    }
                }
            }
        }
    `).then((result) => {
        if (result.errors) {
            result.errors.forEach((e) => console.error(e.toString()));
            return Promise.reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        posts.forEach((edge) => {
            const id = edge.node.id;
            createPage({
                path: edge.node.fields.slug,
                tags: edge.node.frontmatter.tags,
                component: path.resolve(
                    `src/templates/${String(
                        edge.node.frontmatter.templateKey
                    )}.js`
                ),
                // additional data can be passed via context
                context: {
                    id,
                },
            });
        });

        // Tag pages:
        let tags = [];
        // Iterate through each post, putting all found tags into `tags`
        posts.forEach((edge) => {
            if (_.get(edge, `node.frontmatter.tags`)) {
                tags = tags.concat(edge.node.frontmatter.tags);
            }
        });
        // Eliminate duplicate tags
        tags = _.uniq(tags);

        // Make tag pages
        tags.forEach((tag) => {
            const tagPath = `/tags/${_.kebabCase(tag)}/`;

            createPage({
                path: tagPath,
                component: path.resolve(`src/templates/tags.js`),
                context: {
                    tag,
                },
            });
        });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    const { createNodeField } = actions;

    if (node.internal.type === `MarkdownRemark`) {
        const value = createFilePath({ node, getNode });
        createNodeField({
            name: `slug`,
            node,
            value,
        });
    }
};

exports.sourceNodes = ({ actions, getNodes, getNode }) => {
    const { createNodeField } = actions;

    const datasetsOfProjects = {};
    const meetingsOfProjects = {};
    // iterate through all markdown nodes to link datasets to project
    const markdownNodes = getNodes()
        .filter((node) => node.internal.type === "MarkdownRemark")
        .forEach((node) => {
            if (node.frontmatter.project) {
                const projectNode = getNodes().find(
                    (node2) =>
                        node2.internal.type === "MarkdownRemark" &&
                        node2.frontmatter.title === node.frontmatter.project
                );

                if (projectNode) {
                    createNodeField({
                        node,
                        name: "project",
                        value: projectNode.id,
                    });
                    const objectToUse =
                        node.frontmatter.templateKey === "meeting"
                            ? meetingsOfProjects
                            : datasetsOfProjects;

                    if (!(projectNode.id in objectToUse)) {
                        objectToUse[projectNode.id] = [];
                    }
                    objectToUse[projectNode.id].push(node.id);
                }
            }
        });
    Object.entries(datasetsOfProjects).forEach(([projectId, datasetIds]) => {
        createNodeField({
            node: getNode(projectId),
            name: "datasets",
            value: datasetIds,
        });
    });
    Object.entries(meetingsOfProjects).forEach(([projectId, meetingIds]) => {
        createNodeField({
            node: getNode(projectId),
            name: "meetings",
            value: meetingIds,
        });
    });
};
