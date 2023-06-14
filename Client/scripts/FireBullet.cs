using Godot;
using System;

public partial class FireBullet : Node2D
{
	private void SetDis() => GetNode<CollisionShape2D>("FireBulletTexture/FireBulletArea/FireBulletAreaShape").Disabled = true;
	private void SetVis() => Visible = false;
	private void _on_area_2d_area_entered(Area2D area)
	{
		if (area.Name == "PlayerArea")
		{
			CallDeferred("SetVis");
			CallDeferred("SetDis");
		}
	}
}



