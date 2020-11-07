import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Button, Input, Drawer, Badge, Avatar, Spin } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { MenuOutlined, ShoppingCartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../config/axios';
import RightMenu from './RightMenu';
import { MenuContext } from '../../context/carritoContext';
import aws from '../../config/aws';

const { Search } = Input;
const { Header } = Layout;
const { SubMenu } = Menu;

const Navegacion = (props) => {
	const { active, setActive } = useContext(MenuContext);
	const { loading, setLoading } = useContext(MenuContext);
	const [ visible, setVisible ] = useState(false);
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const [ tienda, setTienda ] = useState([]);
	const [ carrito, setCarrito ] = useState(0);
	const [ ofertas, setOfertas ] = useState([]);

	useEffect(
		() => {
			setActive(true);
			obtenerOfertas();
			obtenerQuienesSomos();
			if (token) {
				obtenerCarrito();
			}
		},
		[ token, active ]
	);

	async function obtenerCarrito() {
		await clienteAxios
			.get(`/carrito/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setCarrito(res.data.articulos.length);
			})
			.catch((res) => {
				setCarrito(0);
			});
	}
	async function obtenerQuienesSomos() {
		await clienteAxios
			.get('/tienda')
			.then((res) => {
				res.data.forEach((datos) => {
					setTienda(datos);
				});
			})
			.catch((res) => {
			});
	}
	async function obtenerOfertas() {
		await clienteAxios
			.get('/productos/promocion')
			.then((res) => {
				setOfertas(res.data);
			})
			.catch((res) => {
			});
	}

	const showDrawer = () => {
		setVisible(true);
	};
	const onClose = () => {
		setVisible(false);
	};

	if (loading) {
		return (
			<div className="preloading">
				<div className="contenedor-preloading">
					<Spin size="large" tip="Cargando la tienda..." className="class-spin" />
				</div>
			</div>
		);
	}

	return (
		<Layout className="layout navbar-menu-general a0">
			<Header className="navbar-menu-general a1">
				<div className="menuCon navbar-menu-general a2">
					<div className="top-menu row a3">
						<div className="col-lg-6 a3">
							<div className="row a3">
								{!tienda.imagenLogo ? (
									<div className="d-none" />
								) : (
									<div className="col-3 contenedor-logo d-flex">
										<Link to="/">
											<img
												className="imagen-logo-principal"
												alt="logotipo-tienda"
												src={aws+tienda.imagenLogo}
											/>
										</Link>
									</div>
								)}
								<div className="col-9">
									<Search
										placeholder="¿Qué estás buscando?"
										onSearch={(value) => props.history.push(`/searching/${value}`)}
										className="search-navbar"
									/>
								</div>
							</div>
						</div>
						<div className="col-lg-6 nav-menu-enlaces a4 ">
							<Menu
								className="float-right navbar-menu-general a5"
								/* theme="light" */
								mode="horizontal"
								defaultSelectedKeys={[ window.location.pathname ]}
								inlineIndent={0}
							>
								<Menu.Item className="nav-font-color nav-border-color a6" key="/">
									<p>Inicio</p>
									<Link to="/" />
								</Menu.Item>
								<Menu.Item className="nav-font-color nav-border-color a6" key="/productos">
									<p>Productos</p>
									<Link to="/productos" />
								</Menu.Item>
								{ofertas.length ? (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/ofertas">
										<p>Ofertas</p>
										<Link to="/ofertas" />
									</Menu.Item>
								) : (
									<Menu.Item className="d-none" />
								)}
								<Menu.Item className="nav-font-color nav-border-color a6" key="/blog">
									<p>Blog</p>
									<Link to="/blog" />
								</Menu.Item>
								{tienda.length === 0 ? (
									<Menu.Item className="d-none" />
								) : (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/quienes_somos">
										<p>Quiénes somos</p>
										<Link to="/quienes_somos" />
									</Menu.Item>
								)}
								{!decoded || decoded.rol === true ? (
									<Menu.Item className="d-none" />
								) : (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/pedidos">
										<p>Mis compras</p>
										<Link to="/pedidos" />
									</Menu.Item>
								)}
								{!decoded || decoded.rol === true ? (
									<Menu.Item className="d-none" />
								) : (
									<Menu.Item className="nav-font-color nav-border-color a6" key="/shopping_cart">
										<p>
											<Badge count={carrito}>
												<ShoppingCartOutlined style={{ fontSize: 25 }} />
												<Link to="/shopping_cart" />
											</Badge>
										</p>
									</Menu.Item>
								)}
								{token && decoded['rol'] === false ? (
									<SubMenu
										className="nav-font-color nav-border-color a6"
										icon={
											!decoded.imagen && !decoded.imagenFireBase ? (
												<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
													<p>{decoded.nombre.charAt(0)}</p>
												</Avatar>
											) : decoded.imagenFireBase ? (
												<Avatar size="large" src={decoded.imagenFireBase} />
											) : (
												<Avatar
													size="large"
													src={aws+decoded.imagen}
												/>
											)
										}
									>
										<Menu.Item className=" nav-border-color">
											<SettingOutlined />Mi cuenta<Link to="/perfiles" />
										</Menu.Item>
										<Menu.Item>
											<p
												className="text-danger"
												onClick={() => {
													localStorage.removeItem('token');
													firebase.auth().signOut();
													setTimeout(() => {
														window.location.reload();
													}, 1000);
												}}
											>
												<LogoutOutlined />Cerrar Sesión
											</p>
										</Menu.Item>
									</SubMenu>
								) : decoded && decoded['rol'] === true ? (
									<SubMenu
										className="nav-font-color nav-border-color a6"
										icon={
											!decoded.imagen ? (
												<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
													<p>{decoded.nombre.charAt(0)}</p>
												</Avatar>
											) : (
												<Avatar
													size="large"
													src={aws + decoded.imagen}
												>
													{/* <p>{decoded.nombre.charAt(0)}</p> */}
												</Avatar>
											)
										}
									>
										<Menu.Item className="nav-border-color a6">
											<SettingOutlined />Panel de administrador<Link to="/admin" />
										</Menu.Item>
										<Menu.Item className="nav-font-color nav-border-color a6">
											<p
												className="text-danger"
												onClick={() => {
													localStorage.removeItem('token');
													firebase.auth().signOut();
													setTimeout(() => {
														window.location.reload();
													}, 1000);
												}}
											>
												<LogoutOutlined />Cerrar Sesión
											</p>
										</Menu.Item>
									</SubMenu>
								) : (
									<Menu.Item className="d-none" />
								)}

								{token === '' || token === null ? (
									<Menu.Item className="nav-font-color nav-border-color a6">
										<p>Entrar</p><Link to="/entrar" />
									</Menu.Item>
								) : (
									<Menu.Item className="d-none" />
								)}
							</Menu>
						</div>
					</div>
					<div className="top-menu-responsive nav-font-color">
						<Button type="link" className="barsMenu" onClick={showDrawer}>
							<MenuOutlined style={{ fontSize: 22 }} />
						</Button>
						<Search
							className="search-nav-responsive"
							placeholder="input search text"
							onSearch={(value) => props.history.push(`/searching/${value}`)}
						/>
						{!decoded || decoded.rol === true ? (
							<div className="d-none" />
						) : (
							<Badge count={carrito}>
								<Link to="/shopping_cart">
									<ShoppingCartOutlined style={{ fontSize: 28 }} />
								</Link>
							</Badge>
						)}
					</div>
					<Drawer
						className="drawer-background"
						title={
							!tienda.imagenLogo ? (
								<div className="d-none" />
							) : (
								<div className="contenedor-logo">
									<Link to="/">
										<img
											className="imagen-logo-principal"
											alt="logotipo-tienda"
											src={aws+tienda.imagenLogo}
										/>
									</Link>
								</div>
							)
						}
						placement="left"
						closable={false}
						onClose={onClose}
						visible={visible}
					>
						<RightMenu ofertas={ofertas} tienda={tienda} />
					</Drawer>
				</div>
			</Header>
		</Layout>
	);
};

export default withRouter(Navegacion);
