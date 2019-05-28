import React, { useState, useEffect } from "react"
import { Link } from "gatsby"

import * as THREE from "three"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => {
  const { useRef, useEffect, useState } = React
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(true)
  const [viewObj, setViewObj] = useState(0.1, 0.1)
  const controls = useRef(null)

  useEffect(() => {
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffc87f,
      envMaps: "reflection",
      wireframe: true,
      reflectivity: 0.5,
    })
    const cube = new THREE.Mesh(geometry, material)

    camera.position.z = 4
    scene.add(cube)
    renderer.setClearColor("#000000")
    renderer.setSize(width, height)

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = mount.current.clientWidth
      height = mount.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderScene()
    }
    const handleKeyPress = e => {
      /*
        39 = arrow right
        37 = arrow left
        38 = arrow up
        40 = arrow down
      */
      console.log("e", e.keyCode)

      switch (e.keyCode) {
        case 39:
        case 68:
          cube.rotation.y += 0.25
          break
        case 37:
        case 65:
          cube.rotation.y += -0.25
          break
        case 40:
        case 83:
          cube.rotation.x += 0.25
          break
        case 38:
        case 87:
          cube.rotation.x += -0.25
          break
        default:
          console.log("please press an arrow btn")
      }
      // cube.rotation.x = e.clientY / window.innerWidth
      // cube.rotation.y = e.clientX / window.innerHeight
      // width = mount.current.clientWidth
      // height = mount.current.clientHeight
      // renderer.setSize(width, height)
      // camera.aspect = width / height
      // camera.updateProjectionMatrix()
      renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const animate = () => {
      // cube.rotation.x += 0.01
      // cube.rotation.y += 0.01
      // cube.rotation.x = 0.01
      // cube.rotation.y = 0.01

      renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = null
    }

    mount.current.appendChild(renderer.domElement)
    window.addEventListener("resize", handleResize)
    window.addEventListener("keydown", handleKeyPress)
    start()

    controls.current = { start, stop }

    return () => {
      stop()
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("keydown", handleKeyPress)
      mount.current.removeChild(renderer.domElement)

      scene.remove(cube)
      geometry.dispose()
      material.dispose()
    }
  }, [])

  useEffect(() => {
    if (isAnimating) {
      controls.current.start()
    } else {
      controls.current.stop()
    }
  }, [isAnimating])

  return (
    <div
      style={{ height: "100vh" }}
      className="vis"
      ref={mount}
      onClick={() => setAnimating(!isAnimating)}
    />
  )
}

export default IndexPage
